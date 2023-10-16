import { useEffect, useState } from 'react';
import APIResponse from './components/apiTypes';
import { LocateFixed, Loader2 } from 'lucide-react';
import Map from './components/Map.js'
import './styles/Home.scss'
import './styles/List.scss'



function App() {

  const [geoPosition, setGeoPosition] = useState<GeolocationPosition | null>(null);
  const [numberPosition, setNumberPosition] = useState<[number, number] | null>([50.6310806, 3.0468978]) // De base a Lille
  const [selectedStation, setSelectedStation] = useState<[number, number] | null>(null)

  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null);
  const [stepErrors, setStepErrors] = useState<string | null>(null)
  const [loadingGeoloc, setLoadingGeoloc] = useState<boolean>(false);
  const [loadingApi, setLoadingApi] = useState<boolean>(false);

  const [filterPosition, setFilterPosition] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(true);

  function calculateDistance(point1: number, point2: number, pointA: number, pointB: number) {

    function toRadians(degrees: number) {
      return degrees * (Math.PI / 180);
    }
    // Rayon de la Terre en kilomètres
    const earthRadius = 6371;
  
    // Convertir les degrés en radians
    const lat1 = toRadians(point1);
    const lon1 = toRadians(point2);
    const lat2 = toRadians(pointA);
    const lon2 = toRadians(pointB);
  
    // Différences de latitude et de longitude
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
  
    // Formule Haversine
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    // Distance en kilomètres
    const distance = earthRadius * c;
  
    return distance.toFixed(2);
  }

  function handleListItemClick(lat: number, lon: number) {
    setSelectedStation([lat, lon])
  }

  function displayList() {
    if (!apiResponse) {
      return
    } else {
      const items = apiResponse.results.map((item) => {

        let priceToDisplay = '';
        switch (filterPosition) {
          case 'e10':
            priceToDisplay = item.e10_prix;
            break;
          case 'sp98':
            priceToDisplay = item.sp98_prix;
            break;
          case 'gplc':
            priceToDisplay = item.gplc_prix;
            break;
          case 'sp95':
            priceToDisplay = item.sp95_prix;
            break;
          case 'gazole':
            priceToDisplay = item.gazole_prix;
            break;
          default:
            priceToDisplay = '';
        }        
        
        const distanceInKm = calculateDistance(
          item.geom.lat,
          item.geom.lon,
          numberPosition?.[0] ?? 0,
          numberPosition?.[1] ?? 0
        );
        return(
          <li key={item.id} onClick={() => handleListItemClick(item.geom.lat, item.geom.lon)}>
            <div className="top">
              <div className="left">
                <div className="price-box">
                  <span className={filterPosition || ""}>{filterPosition}</span>
                  <p className='price'>{priceToDisplay + "€"}</p>
                </div>
                <p>{item.adresse}</p>
                <p>{item.ville}</p>

              </div>
              <div className="right">
                <p className='km'>{distanceInKm + " km"}</p>

              </div>
            </div>
            <div className="bottom">
              <div className="left">

              </div>
              <div className="right">
                
              </div>
            </div>
          </li>
        )
      })
      return <ul>{items}</ul>
    }
  }
  
  async function getStations() {

    if (!geoPosition && !filterPosition) {
      return
    } else {
      setLoadingApi(true)
      const url = 'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records'
      const lon = geoPosition && geoPosition.coords.longitude;
      const lat = geoPosition && geoPosition.coords.latitude;
      const km = 5;
      const limit = 100
      const type = filterPosition
    
      const apiUrl = `${url}?where=distance(geom, geom'POINT(${lon} ${lat})',${km}km) and ${type}_prix is not null&order_by=${type}_prix&limit=${limit}`
    
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Réponse de l\'API non valide');
        }
    
        const data = await response.json();
        setApiResponse(data);
        setLoadingApi(false)
      } catch (error) {
        console.error('Erreur lors de la requête API :', error);
        setLoadingApi(false)
      }
    } 
  }


  useEffect(() => {

    if (!geoPosition) {
      setStepErrors('Entrez votre adresse ou geolocalisé vous')
    } else if (!filterPosition) {
      setStepErrors('Sélectionnez un type de carburant')
    } else {
      setStepErrors(null)
      getStations()
    }
  }, [geoPosition, filterPosition]);

  const geoLoading = async () => {
    setLoadingGeoloc(true);
    try {
      const NavigatorGeoPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setGeoPosition(NavigatorGeoPosition);
      setNumberPosition([NavigatorGeoPosition.coords.latitude, NavigatorGeoPosition.coords.longitude])
      setLoadingGeoloc(false)
    } catch (error) {
      console.error('Erreur lors de la requête API :', error);
      setLoadingGeoloc(false)
    }
  }

  function filterActions(carbuType: string) {
    if (!filterOpen) {
      setFilterOpen(true)
    } else {
      setFilterPosition(carbuType)
      setFilterOpen(false)
    }
  }

  return (
    <div>
      <div className="query">
        <div className="container">
          <div className="search-bar">
            <button onClick={() => geoLoading()}>
              {!loadingGeoloc ? <LocateFixed /> : <Loader2 className='loader'/>}
            </button>
            <input placeholder='Votre Adresse' type="search" id="site-search" name="q" />
          </div>
          <div className={`filters ${filterOpen ? 'open' : 'close'}`}>
            <div className={`filters-slider pos-${filterPosition}`}>
                <button className='diesel' onClick={() => filterActions('gazole')}>DIE</button>
                <button className='essence' onClick={() => filterActions('sp95')}>SP95</button>
                <button className='essence' onClick={() => filterActions('e10')}>E10</button>
                <button className='essence' onClick={() => filterActions('sp98')}>SP98</button>
                <button className='gpl' onClick={() => filterActions('gplc')}>GPL</button>
            </div>
          </div>
        </div>

      </div>

      <Map
        geoLoc={numberPosition}
        stations={apiResponse}
        selectedStation={selectedStation}
      />

      <div className="list">
        <div className="container">
          {stepErrors || loadingApi ? 
            <div className="empty">
              <p>{stepErrors && stepErrors}</p>
              {loadingApi ? <Loader2 className='loader'/> : null}
            </div> : null
          }
          {displayList()}
          
        </div>
      </div>

    </div>
  )
}

export default App

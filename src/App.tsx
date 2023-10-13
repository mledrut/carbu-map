import { useEffect, useState } from 'react';
import APIResponse from './components/apiTypes';
import { LocateFixed, Loader2 } from 'lucide-react';
import Map from './components/Map.js'
import './styles/Home.scss'



function App() {

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [prixCarburants, setPrixCarburants] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [filterPosition, setFilterPosition] = useState<string>("gazole");
  const [filterOpen, setFilterOpen] = useState<boolean>(true);

  function displayList() {
    if (!prixCarburants) {
      return
    } else {
      const items = prixCarburants.results.map((item) => {
        return(
          <li key={item.id}>
            <h4>{item.ville}</h4>
          </li>
        )
      })
      return <ul>{items}</ul>
    }
  }
  

  async function getStations() {

    if (!position) {
      return
    } else {
      const lon = position.coords.longitude;
      const lat = position.coords.latitude;
      const km = 10;
      const limit = 10;
    
      const apiUrl = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?where=distance(geom%2C%20geom%27POINT(${lon} ${lat})%27%2C%20${km}km)&limit=${limit}`
    
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Réponse de l\'API non valide');
        }
    
        const data = await response.json();
        setPrixCarburants(data);
        console.log(data)
      } catch (error) {
        console.error('Erreur lors de la requête API :', error);
      }
    } 
  }


  useEffect(() => {
          getStations()        
  }, [position]);

  const geoLoading = async () => {
    setLoading(true);
    try {
      const geoPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setPosition(geoPosition);
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors de la requête API :', error);
      setLoading(false)
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
              {!loading ? <LocateFixed /> : <Loader2 className='loader'/>}
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

      <Map getPosition={() => position} />

      <div className="list">
        <div className="container">
          {displayList()}
        </div>
      </div>

    


    


      {position ? (
        <div>
          {/* Affichez les données de géolocalisation ici */}

          {prixCarburants ? (
            <div>
              {/* Affichez les données de l'API ici */}
            </div>
          ) : (
            <p>En attente des données de l'API...</p>
          )}
        </div>
      ) : (
        <p>En attente de la localisation...</p>
      )}
    </div>
  )
}

export default App

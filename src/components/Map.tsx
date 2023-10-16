import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.scss'
import { useEffect, useRef } from 'react';
import APIResponse from './apiTypes';

type MapProps = {
    geoLoc: [number, number] | null;
    stations: APIResponse | null;
    selectedStation : [number, number] | null;
}

const Map = ({geoLoc, stations, selectedStation} : MapProps) => {

    const mapRef = useRef(null);

    const mapboxAccessToken = import.meta.env.VITE_JAWG_TOKEN;
    const customTileLayer = `https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=${mapboxAccessToken}`;

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.flyTo(geoLoc, 13); 
          }
        console.log(stations)
    }, [geoLoc]);

    useEffect(() => {
        console.log(selectedStation)
        if (mapRef.current && selectedStation) {
          mapRef.current.flyTo(selectedStation, 15); 
        }
      }, [selectedStation]);


    function LocationMarker() {
        return geoLoc === null ? null : (
          <Marker position={geoLoc} icon={locIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )
      }

    const locIcon = new L.Icon({
        iconUrl: "/locIcon.png",
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -44]
    })
    const stationIcon = new L.Icon({
        iconUrl: "/stationIcon.png",
        iconSize: [30, 30],
        popupAnchor: [0, -44]
    })

    return (
        <MapContainer
            style={{ width: '100%', height: 'calc(50vh - 50px)'  }}
            center={geoLoc || [0, 0]}
            zoom={13}
            scrollWheelZoom={true}
            ref={mapRef}
        >
            <TileLayer url={customTileLayer} />
            <ZoomControl position="bottomleft" />
            <LocationMarker />
            {stations && stations.results.map((station, index) => (
                <Marker key={index} icon={stationIcon} position={[station.geom.lat, station.geom.lon]}>
                    <Popup>{station.adresse}</Popup>
                </Marker>
            ))}
        </MapContainer>)
}

export default Map
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

    const mapRef = useRef<L.Map>(null);
    const decalage = -0.006000; // décalge de la map
    const decalageZoom = -0.001000; // décalge de la map

    const mapboxAccessToken = import.meta.env.VITE_JAWG_TOKEN;
    const customTileLayer = `https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=${mapboxAccessToken}`;

    useEffect(() => {
        if (mapRef.current && geoLoc) {
            mapRef.current.flyTo([geoLoc[0] - decalage, geoLoc[1]], 13); 
          }
    }, [geoLoc, decalage]);

    useEffect(() => {
        if (mapRef.current && selectedStation) {
          mapRef.current.flyTo([selectedStation && selectedStation[0] - decalageZoom, selectedStation && selectedStation[1]], 15); 
        }
      }, [selectedStation, decalageZoom]);


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
            style={{ width: '100%', height: 'calc(50svh - 50px)'  }}
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
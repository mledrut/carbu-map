import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import '../styles/Map.scss'
import { useState } from 'react';

type MapProps = {
    getPosition: (position: [number, number] | null) => void;
}



const Map = ({getPosition}: MapProps) => {



    const [position, setPosition] = useState<[number, number] | null>([50.6310806, 3.0468978])

    const mapboxAccessToken = import.meta.env.VITE_JAWG_TOKEN;
    const customTileLayer = `https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=${mapboxAccessToken}`;

    // useEffect(() => {
    //   setPosition(getPosition)
    // }, [getPosition])
    


    return (
        <MapContainer
            style={{ width: '100%', height: '50vh' }}
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            
        >
            <TileLayer
                url={customTileLayer}
                // id="jawg-light" // Remplacez par le style de carte souhaité
    />
          <ZoomControl position="bottomleft" /> {/* Place le contrôle de zoom en bas à gauche */}

        </MapContainer>)
}

export default Map
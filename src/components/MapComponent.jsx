import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '2rem'
};

const MapComponent = ({ center, title }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(m) {
    setMap(m);
  }, []);

  const onUnmount = React.useCallback(function callback(m) {
    setMap(null);
  }, []);

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-[400px] bg-white/5 border border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-slate-500 gap-4">
        <span className="text-4xl text-indigo-500/50">📍</span>
        <p className="font-medium text-sm">Google Maps API Key required to view location</p>
        <div className="p-4 bg-indigo-500/10 rounded-xl text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
          Location: {title}
        </div>
      </div>
    );
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          // ... (Can add more dark mode styles)
        ]
      }}
    >
      <Marker position={center} title={title} />
    </GoogleMap>
  ) : <div className="animate-pulse bg-white/5 h-[400px] rounded-[2rem]"></div>;
};

export default React.memo(MapComponent);

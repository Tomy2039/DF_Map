import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import MarkerForm from './markerForm';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: null,
    audio: null,
    lat: -26.1855, // Latitud predeterminada
    lng: -58.1729, // Longitud predeterminada
  });
  
  // Se establecerá el marcador a la posición inicial
  const [markerPosition, setMarkerPosition] = useState([formData.lat, formData.lng]);

  const fetchMarkers = async () => {
    // ... (tu función existente)
  };

  useEffect(() => {
    fetchMarkers(); // Llama a fetchMarkers en el montaje inicial del componente
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setShowForm(true);
        setEditMode(false);
        setFormData({ ...formData, lat: e.latlng.lat, lng: e.latlng.lng });
        setMarkerPosition([e.latlng.lat, e.latlng.lng]); // Establecer la nueva posición del marcador
      },
    });
    return null;
  };

  // Manejar el movimiento del marcador
  const handleMarkerDrag = (e) => {
    setMarkerPosition(e.target.getLatLng());
    setFormData(prev => ({
      ...prev,
      lat: e.target.getLatLng().lat,
      lng: e.target.getLatLng().lng,
    }));
  };

  return (
    <>
      <MapContainer center={markerPosition} zoom={13} style={{ height: "88vh", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        
        <Marker 
          position={markerPosition} 
          icon={defaultIcon} 
          draggable={true} 
          eventHandlers={{ dragend: handleMarkerDrag }} // Manejador de evento para mover el marcador
        >
          <Popup>
            <h3>Marcador</h3>
            <p>Latitud: {markerPosition[0]}</p>
            <p>Longitud: {markerPosition[1]}</p>
          </Popup>
        </Marker>

        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={defaultIcon}>
            <Popup>
              <h3>{marker.name}</h3>
              <p>{marker.description}</p>
              <p>Categoría: {marker.category}</p>
              {marker.audio && <audio controls src={marker.audio} />}
              {marker.image && <img src={marker.image} alt={marker.name} style={{ width: "100px", height: "100px" }} />}
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleEditMarker(idx)}>Editar</button>
                <button onClick={() => handleDeleteMarker(idx)} style={{ marginLeft: '5px' }}>Eliminar</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showForm && (
        <MarkerForm
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
          setMarkers={setMarkers}
          markers={markers}
          currentMarkerIndex={currentMarkerIndex}
          handleCloseForm={handleCloseForm}
        />
      )}
    </>
  );
};

export default MapComponent;

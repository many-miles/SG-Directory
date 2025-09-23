// src/components/LocationPicker.tsx
"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

// Component to handle map clicks
function LocationMarker({ position, onLocationSelect }: { 
  position: [number, number] | null; 
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
    </Marker>
  );
}

const LocationPicker = ({ onLocationSelect, initialLocation }: LocationPickerProps) => {
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [-34.0489, 24.9087]
  );

  useEffect(() => {
    setIsClient(true);
    // Set default location for Jeffreys Bay if no initial location
    if (!initialLocation) {
      onLocationSelect(-34.0489, 24.9087);
      setPosition([-34.0489, 24.9087]);
    }
  }, [initialLocation, onLocationSelect]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  if (!isClient) {
    return (
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="h-64 rounded-lg overflow-hidden border-2 border-gray-300">
        <MapContainer
          center={position || [-34.0489, 24.9087]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            onLocationSelect={handleLocationSelect}
          />
        </MapContainer>
      </div>
      
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p><strong>📍 Click on the map</strong> to set your service location</p>
        {position && (
          <p className="mt-1">
            Selected: {position[0].toFixed(4)}, {position[1].toFixed(4)}
            {Math.abs(position[0] - (-34.0489)) < 0.3 && Math.abs(position[1] - 24.9087) < 0.3 
              ? " (Jeffreys Bay area ✅)" 
              : " (Outside Jeffreys Bay ⚠️)"}
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
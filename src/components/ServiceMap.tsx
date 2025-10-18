// src/components/ServiceMap.tsx
"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ServiceTypeCard } from '@/types/service';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ServiceMapProps {
  services: Partial<ServiceTypeCard>[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const ServiceMap = ({ 
  services, 
  center = [-34.0489, 24.9087], // Jeffreys Bay coordinates
  zoom = 13,
  height = "400px"
}: ServiceMapProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div 
        className="bg-gray-200 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border-2 border-gray-300">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {services.map((service) => (
          service.location && (
            <Marker
              key={service._id}
              position={[service.location.lat, service.location.lng]}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-semibold text-black">{service.title || "Service"}</h3>
                  <p className="text-gray-600 capitalize">{service.category || "Other"}</p>
                  {service.priceRange && (
                    <p className="text-gray-600">Price: {service.priceRange}</p>
                  )}
                  {service.author && (
                    <p className="text-gray-500">By: {service.author.name || "Unknown"}</p>
                  )}
                  <a 
                    href={`/service/${service._id}`}
                    className="text-blue-600 hover:underline mt-2 inline-block"
                  >
                    View Details →
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default ServiceMap;
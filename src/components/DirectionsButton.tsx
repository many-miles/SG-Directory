// src/components/DirectionsButton.tsx
"use client";

import { useState } from 'react';
import { NavigationIcon, MapPinIcon, ExternalLinkIcon } from 'lucide-react';
import { Button } from './ui/button';

interface DirectionsButtonProps {
  serviceName: string;
  serviceLocation: {
    lat: number;
    lng: number;
  };
  userLocation?: {
    lat: number;
    lng: number;
  } | null;
  distance?: number;
}

const DirectionsButton = ({ 
  serviceName, 
  serviceLocation, 
  userLocation, 
  distance 
}: DirectionsButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleGetDirections = () => {
    const destination = `${serviceLocation.lat},${serviceLocation.lng}`;
    let googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    
    // Add origin if user location is available
    if (userLocation) {
      const origin = `${userLocation.lat},${userLocation.lng}`;
      googleMapsUrl += `&origin=${origin}`;
    }
    
    // Add destination name for better UX
    googleMapsUrl += `&destination_place_id=${encodeURIComponent(serviceName + ', Jeffreys Bay')}`;
    
    // Open in new tab
    window.open(googleMapsUrl, '_blank');
  };

  const handleShowOnMap = () => {
    // Link to your map page with this specific service highlighted
    const mapUrl = `/map?highlight=${serviceLocation.lat},${serviceLocation.lng}&zoom=16`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleGetDirections}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NavigationIcon className="w-4 h-4 mr-2" />
        Get Directions
        <ExternalLinkIcon className="w-3 h-3 ml-2" />
      </Button>
      
      {distance && (
        <div className="text-xs text-gray-600 text-center">
          Approximately {distance.toFixed(1)}km away
          {userLocation && (
            <span className="text-gray-500"> • {Math.round(distance * 0.75)} min drive</span>
          )}
        </div>
      )}
      
      <Button
        onClick={handleShowOnMap}
        variant="outline"
        className="w-full"
        size="sm"
      >
        <MapPinIcon className="w-4 h-4 mr-2" />
        Show on Map
      </Button>
    </div>
  );
};

export default DirectionsButton;
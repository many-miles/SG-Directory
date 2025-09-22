// src/components/LocationSearch.tsx
"use client";

import { useState, useEffect } from 'react';
import { MapPinIcon, TargetIcon, FilterIcon } from 'lucide-react';
import { Button } from './ui/button';
import { getUserLocation, isInJeffreysBay, type Location } from '../lib/distance';
import { toast } from 'sonner';

interface LocationSearchProps {
  onLocationSet: (location: Location | null) => void;
  onDistanceFilterChange: (maxDistance: number | null) => void;
  currentLocation: Location | null;
  maxDistance: number | null;
}

const LocationSearch = ({
  onLocationSet,
  onDistanceFilterChange,
  currentLocation,
  maxDistance
}: LocationSearchProps) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const location = await getUserLocation();
      
      if (!isInJeffreysBay(location)) {
        toast.warning("You're outside Jeffreys Bay area. Showing all services.");
      } else {
        toast.success("Location found! Showing services near you.");
      }
      
      onLocationSet(location);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to get location';
      setLocationError(errorMessage);
      toast.error("Could not get your location. Please check your browser settings.");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleClearLocation = () => {
    onLocationSet(null);
    onDistanceFilterChange(null);
    setLocationError(null);
    toast.info("Location filter cleared");
  };

  const distanceOptions = [
    { value: 1, label: "Within 1km" },
    { value: 2, label: "Within 2km" },
    { value: 5, label: "Within 5km" },
    { value: 10, label: "Within 10km" },
    { value: 20, label: "Within 20km" },
  ];

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <MapPinIcon className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Find Services Near You</h3>
      </div>

      {!currentLocation ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Get services sorted by distance from your location
          </p>
          
          <Button 
            onClick={handleGetLocation}
            disabled={isGettingLocation}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            {isGettingLocation ? (
              <>Getting location...</>
            ) : (
              <>
                <TargetIcon className="w-4 h-4 mr-2" />
                Find Services Near Me
              </>
            )}
          </Button>

          {locationError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              <p><strong>Location Error:</strong> {locationError}</p>
              <p className="mt-1">Try enabling location services and refreshing the page.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>📍 Location enabled</p>
              <p className="text-xs">
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearLocation}
            >
              Clear
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <FilterIcon className="w-4 h-4 inline mr-1" />
              Distance Filter
            </label>
            <select 
              value={maxDistance || ''} 
              onChange={(e) => onDistanceFilterChange(e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All distances</option>
              {distanceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
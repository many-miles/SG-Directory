// src/components/LocationSearch.tsx
"use client";

import { useState } from 'react';
import { MapPinIcon, TargetIcon, FilterIcon } from 'lucide-react';
import { Button } from './ui/button';
import { getUserLocation, isInJeffreysBay, type Location } from '../lib/distance';
import { toast } from 'sonner';
import { LocationSearchProps } from "@/types/props";

export default function LocationSearch({
  onLocationChange,
  onDistanceFilterChange,
  currentLocation,
  maxDistance
}: LocationSearchProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLat, setManualLat] = useState('-34.0489');
  const [manualLng, setManualLng] = useState('24.9087');

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      console.log('Attempting to get location...');
      const location = await getUserLocation();
      console.log('Got location:', location);
      
      if (!isInJeffreysBay(location)) {
        toast.warning("You're outside Jeffreys Bay area. Showing all services.");
      } else {
        toast.success("Location found! Showing services near you.");
      }
      
      onLocationChange(location);
    } catch (error) {
      console.error('Location error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unable to get location';
      setLocationError(errorMessage);
      toast.error("Could not get your location. Try manual entry below.");
      setShowManualInput(true);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleManualLocation = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Please enter valid coordinates");
      return;
    }
    
    const location = { lat, lng };
    onLocationChange(location);
    toast.success("Manual location set!");
    setShowManualInput(false);
    setLocationError(null);
  };

  const handleClearLocation = () => {
    onLocationChange(null);
    onDistanceFilterChange(null);
    setLocationError(null);
    setShowManualInput(false);
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
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded border">
              <p><strong>Location Error:</strong> {locationError}</p>
              <div className="mt-2 space-y-2">
                <p className="text-xs">Quick fixes to try:</p>
                <ul className="text-xs space-y-1 ml-4">
                  <li>• Refresh the page and try again</li>
                  <li>• Check if location is enabled in browser settings</li>
                  <li>• Try using Chrome or Firefox</li>
                  <li>• Use manual location entry below</li>
                </ul>
              </div>
            </div>
          )}

          {(locationError || showManualInput) && (
            <div className="border-t pt-3 mt-3">
              <p className="text-sm font-medium mb-2">Manual Location Entry:</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.0001"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="Latitude"
                  className="p-2 border rounded text-sm"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="Longitude"
                  className="p-2 border rounded text-sm"
                />
              </div>
              <Button 
                onClick={handleManualLocation}
                className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white"
                size="sm"
              >
                Use Manual Location
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Default is Jeffreys Bay center (-34.0489, 24.9087)
              </p>
            </div>
          )}

          {!showManualInput && !locationError && (
            <Button 
              onClick={() => setShowManualInput(true)}
              variant="outline"
              className="w-full"
              size="sm"
            >
              Or enter location manually
            </Button>
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

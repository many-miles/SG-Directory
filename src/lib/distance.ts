// src/lib/distance.ts
export interface Location {
  lat: number;
  lng: number;
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in kilometers
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km away`;
  } else {
    return `${Math.round(distance)}km away`;
  }
}

// Filter services by distance
export function filterServicesByDistance(
  services: any[], 
  userLocation: Location, 
  maxDistance: number
): any[] {
  return services
    .map(service => ({
      ...service,
      distance: service.location 
        ? calculateDistance(userLocation, service.location)
        : null
    }))
    .filter(service => service.distance !== null && service.distance <= maxDistance)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

// Get user's current location
export function getUserLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Cache for 1 minute
      }
    );
  });
}

// Check if location is within Jeffreys Bay area (rough bounds)
export function isInJeffreysBay(location: Location): boolean {
  const JB_BOUNDS = {
    north: -33.9,
    south: -34.1,
    east: 25.0,
    west: 24.8
  };
  
  return (
    location.lat >= JB_BOUNDS.south &&
    location.lat <= JB_BOUNDS.north &&
    location.lng >= JB_BOUNDS.west &&
    location.lng <= JB_BOUNDS.east
  );
}
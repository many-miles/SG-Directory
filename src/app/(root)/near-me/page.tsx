// src/app/(root)/near-me/page.tsx
// src/app/(root)/near-me/page.tsx
"use client";

import { useState, useEffect } from 'react';
import ServiceCard, { ServiceTypeCard } from "@/components/ServiceCard";
import LocationSearch from "@/components/LocationSearch";
import { client } from "@/sanity/lib/client";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import { filterServicesByDistance, type Location } from "@/lib/distance";

export default function NearMePage() {
  const [posts, setPosts] = useState<ServiceTypeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(5); // Default 5km
  const [filteredPosts, setFilteredPosts] = useState<ServiceTypeCard[]>([]);

  // Fetch services on component mount
  useEffect(() => {
  const fetchServices = async () => {
    try {
      const services = await client.fetch(SERVICES_QUERY, { search: null, category: null });

      const normalizedServices = (services || []).map((s: any) => ({
        ...s,
        availability: s.availability ?? [], // replace null with empty array
      }));

      setPosts(normalizedServices);
      setFilteredPosts(normalizedServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchServices();
}, []);


  // Filter posts based on location and distance
  useEffect(() => {
    if (!userLocation) {
      setFilteredPosts(posts);
      return;
    }

    let filtered = [...posts];

    if (maxDistance) {
      filtered = filterServicesByDistance(filtered, userLocation, maxDistance);
    } else {
      // If we have user location but no distance filter, just add distances and sort
      filtered = filtered
        .map(service => ({
          ...service,
          distance: service.location 
            ? require('../../../lib/distance').calculateDistance(userLocation, service.location)
            : undefined
        }))
        .filter(service => service.distance !== undefined)
        .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    setFilteredPosts(filtered);
  }, [posts, userLocation, maxDistance]);

  return (
    <>
      <section className="pink_container !min-h-[200px]">
        <h1 className="heading">Services Near You</h1>
        <p className="sub-heading">
          Find local services sorted by distance from your location
        </p>
      </section>

      <section className="section_container">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Location Search Sidebar */}
          <div className="lg:col-span-1">
            <LocationSearch 
              onLocationSet={setUserLocation}
              onDistanceFilterChange={setMaxDistance}
              currentLocation={userLocation}
              maxDistance={maxDistance}
            />

            {/* Category Filters */}
            <div className="mt-6 bg-white border-2 border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Filter by Category</h3>
              <div className="space-y-2">
                {[
                  { value: "all", label: "All Services", emoji: "📍" },
                  { value: "surfing", label: "Surfing", emoji: "🏄‍♂️" },
                  { value: "accommodation", label: "Accommodation", emoji: "🏠" },
                  { value: "food", label: "Food", emoji: "🍽️" },
                  { value: "tours", label: "Tours", emoji: "🗺️" },
                ].map((cat) => (
                  <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      value={cat.value}
                      className="text-primary"
                      defaultChecked={cat.value === "all"}
                    />
                    <span className="text-sm">
                      {cat.emoji} {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Status */}
            {userLocation && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                <p className="text-green-800 font-medium">
                  📍 Showing {filteredPosts.length} services
                  {maxDistance ? ` within ${maxDistance}km` : ' sorted by distance'}
                </p>
                
                {filteredPosts.length > 0 && filteredPosts[0].distance && (
                  <p className="text-green-600 mt-1">
                    Closest: {(filteredPosts[0].distance).toFixed(1)}km away
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="flex-between mb-6">
                  <div>
                    <h2 className="text-30-semibold">
                      {userLocation 
                        ? `${filteredPosts.length} Services Near You`
                        : `${posts.length} Services in Jeffreys Bay`
                      }
                    </h2>
                    {!userLocation && (
                      <p className="text-gray-600 mt-1">
                        Enable location to see services sorted by distance
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                  <a href="/map" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    📍 View Map
                    </a>
                 <a href="/" className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                     All Services
                    </a>
                    </div> 
                  </div>
                <ul className="card_grid">
                  {filteredPosts?.length > 0 ? (
                    filteredPosts.map((post: any) => (
                      <ServiceCard key={post?._id} post={post as ServiceTypeCard} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="no-results text-xl mb-2">No services found</p>
                      <p className="text-black-300">
                        {userLocation && maxDistance 
                          ? `No services within ${maxDistance}km of your location. Try increasing the distance or browse all services.`
                          : userLocation
                          ? "Enable location permissions to find services near you."
                          : "Click 'Find Services Near Me' to see distance-sorted results."}
                      </p>
                      <a 
                        href="/service/create" 
                        className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        List Your Service
                      </a>
                    </div>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
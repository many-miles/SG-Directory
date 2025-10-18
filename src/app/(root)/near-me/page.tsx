// src/app/(root)/near-me/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PortableTextBlock } from '@portabletext/types';
import ServiceCard from "@/components/ServiceCard";
import LocationSearch from "@/components/LocationSearch";
import AdvancedFilters, { FilterState } from "@/components/AdvancedFilters";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { client } from "@/sanity/lib/client";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import { ServiceTypeCard } from "@/types/service";
import { filterServicesByDistance, calculateDistance, type Location } from "@/lib/distance";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function NearMePage() {
  const [allServices, setAllServices] = useState<ServiceTypeCard[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceTypeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { userLocation, setUserLocation, savedServices, saveService, unsaveService, shareService, isSaved } = useUser();
  const [showFilters, setShowFilters] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number | null>(5);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRanges: [],
    maxDistance: 5,
    availability: [],
    sortBy: "distance",
    hasContactInfo: false,
    featured: false,
  });

      useEffect(() => {
      const fetchServices = async () => {
        try {
          const services = await client.fetch(SERVICES_QUERY, { search: null, category: null });

          // Normalize data to match ServiceTypeCard
          const normalized = (services || []).map((s) => {
            const service: ServiceTypeCard = {
              _id: s._id || '',
              title: s.title,
              slug: s.slug && s.slug.current ? { current: s.slug.current } : { current: "" },
              _createdAt: s._createdAt || '',
              author: s.author,
              image: s.image,
              category: s.category,
              description: s.description,
              views: s.views || 0,
              pitch: s.pitch ? s.pitch as PortableTextBlock[] : null,
              location: s.location ? { lat: Number(s.location.lat), lng: Number(s.location.lng) } : null,
              priceRange: s.priceRange,
              serviceRadius: s.serviceRadius,
              availability: s.availability,
              contactMethod: s.contactMethod,
              contactDetails: s.contactDetails,
              isActive: true // Default to true for existing services
            };
            return service;
          });

          setAllServices(normalized);
        } catch (error) {
          console.error("Failed to fetch services:", error);
          toast.error("Failed to load services");
        } finally {
          setLoading(false);
        }
      };

      fetchServices();
    }, []);


  useEffect(() => {
    let result = [...allServices];

    if (userLocation) {
      result = result.map((service) => ({
        ...service,
        distance: service.location ? calculateDistance(userLocation, service.location) : undefined,
      }));
    }

    if (filters.categories.length > 0) {
      result = result.filter((service) => service.category && filters.categories.includes(service.category));
    }

    if (filters.priceRanges.length > 0) {
      result = result.filter((service) => service.priceRange && filters.priceRanges.includes(service.priceRange));
    }

    if (maxDistance) {
      result = result.filter((service) => service.distance !== null && service.distance !== undefined && service.distance <= maxDistance);
    }

    if (filters.availability.length > 0) {
      result = result.filter((service) =>
        service.availability && service.availability.length > 0 && filters.availability.some((day) => service.availability!.includes(day))
      );
    }

    if (filters.featured) {
      result = result.filter((service) => service.featured === true);
    }

    if (filters.hasContactInfo) {
      result = result.filter((service) => service.contactDetails && service.contactDetails.trim() !== "");
    }

    switch (filters.sortBy) {
      case "distance":
        if (userLocation) {
          result = result.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        }
        break;
      case "price-low":
        result = result.sort((a, b) => {
          const priceOrder = ["free", "budget", "moderate", "premium", "luxury", "quote"];
          return priceOrder.indexOf(a.priceRange || "quote") - priceOrder.indexOf(b.priceRange || "quote");
        });
        break;
      case "price-high":
        result = result.sort((a, b) => {
          const priceOrder = ["free", "budget", "moderate", "premium", "luxury", "quote"];
          return priceOrder.indexOf(b.priceRange || "quote") - priceOrder.indexOf(a.priceRange || "quote");
        });
        break;
      case "newest":
        result = result.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
        break;
      case "popular":
        // Assuming popularity is based on some metric, e.g., views (not provided in schema)
        // Placeholder: sort by _createdAt as fallback
        result = result.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
        break;
    }

    setFilteredServices(result);
  }, [allServices, userLocation, filters]);

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRanges: [],
      maxDistance: 5,
      availability: [],
      sortBy: "distance",
      hasContactInfo: false,
      featured: false,
    });
  };

  return (
    <section>
      <section className="pink_container pattern w-full">
        <div className="text-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading">Find Services Near You</h1>
          <p className="sub-heading !max-w-3xl mx-auto">
            Discover trusted local service providers in Jeffreys Bay, tailored to your location.
          </p>
        </div>
      </section>

      <section className="section_container w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full">
          <LocationSearch
              onLocationChange={setUserLocation}
              onDistanceFilterChange={setMaxDistance}
              currentLocation={userLocation}
              maxDistance={maxDistance}
            />

            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {showFilters ? "Hide" : "Show"} Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>

            {showFilters && (
              <AdvancedFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
                totalResults={filteredServices.length}
                userLocation={userLocation}
              />
            )}

            <AnalyticsDashboard services={filteredServices} />

          {savedServices.length > 0 && (
            <div className="mb-8 w-full">
              <h2 className="text-30-semibold mb-4">Saved Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allServices
                  .filter((service) => savedServices.includes(service._id))
                  .map((service) => (
                    <ServiceCard key={service._id} post={service} />
                  ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="service-card">
                  <div className="flex flex-col gap-4 p-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
                <div>
                  <h2 className="text-30-semibold">
                    {filteredServices.length} Services Found
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {userLocation
                      ? `Sorted by ${filters.sortBy === "distance" ? "distance from you" : filters.sortBy}`
                      : "Enable location for distance-based sorting"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/map"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    View Map
                  </a>
                  <a
                    href="/"
                    className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    All Services
                  </a>
                </div>
              </div>

              {filteredServices.length !== allServices.length && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg w-full">
                  <p className="text-blue-800 text-sm">
                    Showing {filteredServices.length} of {allServices.length} services
                    {userLocation && filters.maxDistance && (
                      <span> within {filters.maxDistance}km of your location</span>
                    )}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <ServiceCard key={service._id} post={service} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl mb-2 font-semibold">No services match your criteria</p>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or expanding your search area
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap">
                      <button
                        onClick={handleClearFilters}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Clear All Filters
                      </button>
                      <a
                        href="/service/create"
                        className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        List Your Service
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
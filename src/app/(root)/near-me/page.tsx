// src/app/(root)/near-me/page.tsx - Phase 4 Complete
"use client";

import { useState, useEffect } from 'react';
import EnhancedServiceCard from "@/components/EnhancedServiceCard";
import LocationSearch from "@/components/LocationSearch";
import AdvancedFilters, { FilterState } from "@/components/AdvancedFilters";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { client } from "@/sanity/lib/client";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import { filterServicesByDistance, calculateDistance, type Location } from "@/lib/distance";
import { toast } from 'sonner';

export default function NearMePage() {
  const [allServices, setAllServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [savedServices, setSavedServices] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRanges: [],
    maxDistance: 5,
    availability: [],
    sortBy: 'distance',
    hasContactInfo: false,
    featured: false
  });

  // Load saved services from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedServices');
    if (saved) {
      setSavedServices(JSON.parse(saved));
    }
  }, []);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await client.fetch(SERVICES_QUERY, { search: null, category: null });
        setAllServices(services || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Apply all filters whenever services, location, or filters change
  useEffect(() => {
    let result = [...allServices];

    // Add distances if user location is available
    if (userLocation) {
      result = result.map(service => ({
        ...service,
        distance: service.location 
          ? calculateDistance(userLocation, service.location)
          : undefined
      }));
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      result = result.filter(service => 
        filters.categories.includes(service.category)
      );
    }

    // Apply price filters
    if (filters.priceRanges.length > 0) {
      result = result.filter(service => 
        filters.priceRanges.includes(service.priceRange)
      );
    }

    // Apply distance filter
   if (userLocation && filters.maxDistance != null) {
  const maxDistance = filters.maxDistance; // TS now knows this is number
  result = result.filter(service =>
    service.distance !== undefined && service.distance <= maxDistance
  );
}


    // Apply availability filter
    if (filters.availability.length > 0) {
      result = result.filter(service => 
        service.availability && 
        filters.availability.some(day => service.availability.includes(day))
      );
    }

    // Apply special filters
    if (filters.featured) {
      result = result.filter(service => service.featured === true);
    }

    if (filters.hasContactInfo) {
      result = result.filter(service => 
        service.contactDetails && service.contactDetails.trim() !== ''
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'distance':
        if (userLocation) {
          result = result.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        }
        break;
      case 'newest':
        result = result.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
        break;
      case 'popular':
        result = result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'price-low':
        result = result.sort((a, b) => {
          const priceOrder = ['free', 'budget', 'moderate', 'premium', 'luxury', 'quote'];
          const aIndex = priceOrder.indexOf(a.priceRange) || 999;
          const bIndex = priceOrder.indexOf(b.priceRange) || 999;
          return aIndex - bIndex;
        });
        break;
      case 'price-high':
        result = result.sort((a, b) => {
          const priceOrder = ['free', 'budget', 'moderate', 'premium', 'luxury', 'quote'];
          const aIndex = priceOrder.indexOf(a.priceRange) || 999;
          const bIndex = priceOrder.indexOf(b.priceRange) || 999;
          return bIndex - aIndex;
        });
        break;
    }

    setFilteredServices(result);
  }, [allServices, userLocation, filters]);

  // Handle saving services
  const handleSaveService = (serviceId: string) => {
    const newSaved = savedServices.includes(serviceId)
      ? savedServices.filter(id => id !== serviceId)
      : [...savedServices, serviceId];
    
    setSavedServices(newSaved);
    localStorage.setItem('savedServices', JSON.stringify(newSaved));
    
    toast.success(
      savedServices.includes(serviceId) 
        ? 'Service removed from saved' 
        : 'Service saved!'
    );
  };

  // Handle sharing services
  const handleShareService = (serviceId: string) => {
    toast.success('Link copied to clipboard!');
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRanges: [],
      maxDistance: userLocation ? 5 : null,
      availability: [],
      sortBy: userLocation ? 'distance' : 'newest',
      hasContactInfo: false,
      featured: false
    });
    toast.info('All filters cleared');
  };

  return (
    <>
      <section className="pink_container pattern !min-h-[200px]">
        <h1 className="heading">Services Near You</h1>
        <p className="sub-heading">
          Advanced filtering and location-based discovery for Jeffreys Bay services
        </p>
      </section>

      <section className="section_container">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters and Analytics */}
          <div className="lg:col-span-1 space-y-6 flex flex-col">
            {/* Location Search */}
            <LocationSearch 
              onLocationSet={setUserLocation}
              onDistanceFilterChange={(distance) => 
                setFilters(prev => ({ ...prev, maxDistance: distance }))
              }
              currentLocation={userLocation}
              maxDistance={filters.maxDistance}
            />

            {/* Advanced Filters */}
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
              totalResults={filteredServices.length}
              userLocation={userLocation}
            />

            {/* Analytics Dashboard */}
            <AnalyticsDashboard
              services={filteredServices}
              userLocation={userLocation}
            />

            {/* Saved Services Quick Access */}
            {savedServices.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  💾 Saved Services ({savedServices.length})
                </h3>
                <div className="space-y-1">
                  {savedServices.slice(0, 3).map(serviceId => {
                    const service = allServices.find(s => s._id === serviceId);
                    return service ? (
                      <div key={serviceId} className="text-sm">
                        <a 
                          href={`/service/${serviceId}`}
                          className="text-primary hover:underline line-clamp-1"
                        >
                          {service.title}
                        </a>
                      </div>
                    ) : null;
                  })}
                  {savedServices.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{savedServices.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Services Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex-between mb-6">
                  <div>
                    <h2 className="text-30-semibold">
                      {filteredServices.length} Services Found
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {userLocation 
                        ? `Sorted by ${filters.sortBy === 'distance' ? 'distance from you' : filters.sortBy}`
                        : 'Enable location for distance-based sorting'
                      }
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
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

                {/* Results Summary */}
                {filteredServices.length !== allServices.length && (
                  <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      Showing {filteredServices.length} of {allServices.length} services
                      {userLocation && filters.maxDistance && (
                        <span> within {filters.maxDistance}km of your location</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <EnhancedServiceCard
                        key={service._id}
                        post={service}
                        userLocation={userLocation}
                        showDirections={!!userLocation}
                        onSave={handleSaveService}
                        onShare={handleShareService}
                        isSaved={savedServices.includes(service._id)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <p className="text-xl mb-2 font-semibold">No services match your criteria</p>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your filters or expanding your search area
                      </p>
                      <div className="flex justify-center gap-3">
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
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
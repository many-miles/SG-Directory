// src/components/UserServices.tsx - Updated with save/share functionality
"use client";

import React, { useEffect, useState } from "react";
import { client } from "../sanity/lib/client";
import { SERVICES_BY_AUTHOR_QUERY } from "../sanity/lib/queries";
import ServiceCard from "../components/ServiceCard";
import { ServiceTypeCard } from "../types/service";
import { Service } from "../sanity/types";
import { useUser } from "../context/UserContext";
import { calculateDistance } from "../lib/distance";

interface UserServicesProps {
  id: string;
  showSaveShare?: boolean;
}

const UserServices = ({ id, showSaveShare = true }: UserServicesProps) => {
  const [services, setServices] = useState<ServiceTypeCard[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { userLocation, isSaved, saveService, unsaveService, shareService } = useUser();

 useEffect(() => {
  const fetchServices = async () => {
    try {
      const fetchedServices = await client.fetch<Array<Service>>(SERVICES_BY_AUTHOR_QUERY, { id });

  
      const processedServices = (fetchedServices || []).map(service => {
  if (
    userLocation &&
    service.location?.lat !== undefined &&
    service.location?.lng !== undefined
  ) {
    return {
      ...service,
      distance: calculateDistance(
        userLocation,
        { lat: service.location.lat, lng: service.location.lng }
      )
    };
  }

  return { ...service, distance: undefined };
});

setServices(processedServices as unknown as ServiceTypeCard[]);
    } catch (error) {
      console.error("Failed to fetch user services:", error);
    } finally {
      setLoading(false);
    }
  };

    fetchServices();
  }, [id, userLocation]);

  const handleSaveService = (serviceId: string) => {
    if (isSaved(serviceId)) {
      unsaveService(serviceId);
    } else {
      saveService(serviceId);
    }
  };

  const handleShareService = async (serviceId: string) => {
    const service = services.find(s => s._id === serviceId);
    await shareService(serviceId, service?.title || undefined, service?.description || undefined);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="service-card">
            <div className="flex flex-col gap-4 p-6">
              <div className="flex justify-between items-start">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-40 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services?.length > 0 ? (
        services.map((service) => (
          <ServiceCard 
            key={service._id} 
            post={service}
          />
        ))
      ) : (
        <p className="no-result text-center py-8 col-span-full">No services yet</p>
      )}
    </div>
  );
};

export default UserServices;
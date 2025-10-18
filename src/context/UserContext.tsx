// src/context/UserContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type Location = {
  lat: number;
  lng: number;
};

interface UserContextType {
  // Location state
  userLocation: Location | null;
  setUserLocation: (location: Location | null) => void;

  // Saved services
  savedServices: string[];
  saveService: (serviceId: string) => void;
  unsaveService: (serviceId: string) => void;
  isSaved: (serviceId: string) => boolean;

  // Share functionality
  shareService: (serviceId: string, title?: string, description?: string) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocationState] = useState<Location | null>(null);
  const [savedServices, setSavedServices] = useState<string[]>([]);

  // Load saved data and attempt to get geolocation on mount
  useEffect(() => {
    // Load saved services
    const saved = localStorage.getItem("savedServices");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSavedServices(parsed);
        } else {
          console.error("Invalid savedServices format in localStorage");
        }
      } catch (error) {
        console.error("Error loading saved services:", error);
        toast.error("Failed to load saved services");
      }
    }

    // Load user location
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        if (parsed && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
          setUserLocationState(parsed);
        } else {
          console.error("Invalid userLocation format in localStorage");
        }
      } catch (error) {
        console.error("Error loading user location:", error);
        toast.error("Failed to load saved location");
      }
    }

    // Attempt to get geolocation if not set
    if (typeof window !== "undefined" && navigator.geolocation && window.location.protocol === "https:") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success("Location set automatically");
        },
        (error) => {
          console.warn("Geolocation unavailable:", error.message || error);
          toast.info("Please set your location manually in the search bar");
        },
        { timeout: 10000 }
      );
    } else {
      console.warn("Geolocation not supported or running on HTTP. Please set location manually.");
      toast.info("Please set your location manually in the search bar");
    }
  }, []);

  // Persist user location to localStorage
  const setUserLocation = (location: Location | null) => {
    setUserLocationState(location);
    if (location) {
      try {
        localStorage.setItem("userLocation", JSON.stringify(location));
        toast.success("Location saved for this session");
      } catch (error) {
        console.error("Error saving user location:", error);
        toast.error("Failed to save location");
      }
    } else {
      localStorage.removeItem("userLocation");
      toast.info("Location cleared");
    }
  };

  // Save service functionality
  const saveService = (serviceId: string) => {
    if (!savedServices.includes(serviceId)) {
      const newSaved = [...savedServices, serviceId];
      setSavedServices(newSaved);
      try {
        localStorage.setItem("savedServices", JSON.stringify(newSaved));
        toast.success("Service saved!");
      } catch (error) {
        console.error("Error saving service:", error);
        toast.error("Failed to save service");
      }
    }
  };

  // Unsave service functionality
  const unsaveService = (serviceId: string) => {
    const newSaved = savedServices.filter((id) => id !== serviceId);
    setSavedServices(newSaved);
    try {
      localStorage.setItem("savedServices", JSON.stringify(newSaved));
      toast.success("Service removed from saved");
    } catch (error) {
      console.error("Error removing saved service:", error);
      toast.error("Failed to remove saved service");
    }
  };

  // Check if service is saved
  const isSaved = (serviceId: string) => savedServices.includes(serviceId);

  // ✅ Share service functionality
  const shareService = async (serviceId: string, title?: string, description?: string): Promise<void> => {
    const shareData = {
      title: title || "Service in Jeffreys Bay",
      text: description || "Check out this service in Jeffreys Bay",
      url: `${window.location.origin}/service/${serviceId}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Service shared!");
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          try {
            // Wait a bit for focus to return
            await new Promise((r) => setTimeout(r, 300));
            await navigator.clipboard.writeText(shareData.url);
            toast.success("Link copied to clipboard!");
          } catch (clipboardErr) {
            console.warn("Clipboard fallback failed:", clipboardErr);
            toast.error("Could not copy link. Please copy it manually.");
          }
        }
      }
    } else {
      // Fallback for browsers without navigator.share
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      } catch (clipboardErr) {
        console.warn("Clipboard write failed:", clipboardErr);
        toast.error("Could not copy link. Please copy it manually.");
      }
    }
  };

  // ✅ Properly close the component here!
  return (
    <UserContext.Provider
      value={{
        userLocation,
        setUserLocation,
        savedServices,
        saveService,
        unsaveService,
        isSaved,
        shareService,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ✅ Hook export
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

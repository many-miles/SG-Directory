// src/types/props.ts
import { Dispatch, SetStateAction } from "react";

export interface FormState {
  error?: string;
  status?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface FilterState {
  categories: string[];
  priceRanges: string[];
  maxDistance: number | null;
  availability: string[];
  sortBy: "distance" | "newest" | "popular" | "price-low" | "price-high";
  hasContactInfo: boolean;
  featured: boolean;
}

export interface LocationSearchProps {
  onLocationChange: (location: Location | null) => void;
  onDistanceFilterChange: (maxDistance: number | null) => void;
  currentLocation: Location | null;
  maxDistance: number | null;
}

export interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: Dispatch<SetStateAction<FilterState>>;
  onClearFilters: () => void;
  totalResults: number;
  userLocation: Location | null;
}

export interface AnalyticsDashboardProps {
  services: Array<{
    category: string | null;
    priceRange: string | null;
    location: Location | null;
    availability: string[] | null;
  }>;
  className?: string;
}
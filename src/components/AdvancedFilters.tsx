// src/components/AdvancedFilters.tsx
"use client";

import { useState } from 'react';
import { FilterIcon, XIcon, SlidersHorizontalIcon } from 'lucide-react';
import { Location } from '@/types/props';
import { Button } from './ui/button';

export interface FilterState {
  categories: string[];
  priceRanges: string[];
  maxDistance: number | null;
  availability: string[];
  sortBy: 'distance' | 'newest' | 'popular' | 'price-low' | 'price-high';
  hasContactInfo: boolean;
  featured: boolean;
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  totalResults: number;
  userLocation: Location | null;
}

const AdvancedFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  totalResults,
  userLocation
}: AdvancedFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const categories = [
    { value: 'accommodation', label: 'Accommodation', emoji: '🏠' },
    { value: 'surfing', label: 'Surfing Lessons', emoji: '🏄‍♂️' },
    { value: 'tours', label: 'Tours & Activities', emoji: '🗺️' },
    { value: 'food', label: 'Food & Catering', emoji: '🍽️' },
    { value: 'transport', label: 'Transport', emoji: '🚗' },
    { value: 'home', label: 'Home Services', emoji: '🔧' },
    { value: 'beauty', label: 'Beauty & Wellness', emoji: '💆‍♀️' },
    { value: 'events', label: 'Events', emoji: '🎉' },
    { value: 'other', label: 'Other', emoji: '📋' }
  ];

  const priceRanges = [
    { value: 'free', label: 'Free', emoji: '🆓' },
    { value: 'budget', label: 'R0 - R100', emoji: '💰' },
    { value: 'moderate', label: 'R100 - R500', emoji: '💳' },
    { value: 'premium', label: 'R500 - R1000', emoji: '💎' },
    { value: 'luxury', label: 'R1000+', emoji: '👑' },
    { value: 'quote', label: 'Contact for Quote', emoji: '📞' }
  ];

  const availability = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const sortOptions = [
    { value: 'distance' as const, label: 'Distance (Near to Far)', disabled: !userLocation },
    { value: 'newest' as const, label: 'Newest First' },
    { value: 'popular' as const, label: 'Most Popular' },
    { value: 'price-low' as const, label: 'Price: Low to High' },
    { value: 'price-high' as const, label: 'Price: High to Low' }
  ];

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriceToggle = (price: string) => {
    const newPrices = filters.priceRanges.includes(price)
      ? filters.priceRanges.filter(p => p !== price)
      : [...filters.priceRanges, price];
    
    onFiltersChange({ ...filters, priceRanges: newPrices });
  };

  const handleAvailabilityToggle = (day: string) => {
    const newAvailability = filters.availability.includes(day)
      ? filters.availability.filter(d => d !== day)
      : [...filters.availability, day];
    
    onFiltersChange({ ...filters, availability: newAvailability });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.priceRanges.length > 0 ||
    filters.maxDistance !== null ||
    filters.availability.length > 0 ||
    filters.hasContactInfo ||
    filters.featured ||
    filters.sortBy !== 'distance';

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontalIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Advanced Filters</h3>
          <span className="text-sm text-gray-500">({totalResults} results)</span>
        </div>
        
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <XIcon className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="sm"
          >
            <FilterIcon className="w-4 h-4 mr-1" />
            {isExpanded ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {/* Quick Filter Tags */}
      {!isExpanded && hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map(cat => (
            <span key={cat} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              {categories.find(c => c.value === cat)?.emoji} {cat}
              <button onClick={() => handleCategoryToggle(cat)} className="ml-1">
                <XIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.priceRanges.map(price => (
            <span key={price} className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {priceRanges.find(p => p.value === price)?.emoji} {price}
              <button onClick={() => handlePriceToggle(price)} className="ml-1">
                <XIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.maxDistance && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              📍 Within {filters.maxDistance}km
            </span>
          )}
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-6 border-t pt-4">
          {/* Sort By */}
          <div>
            <h4 className="font-medium mb-2">Sort By</h4>
            <select
              value={filters.sortBy}
              onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label} {option.disabled ? '(Enable location)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium mb-2">Service Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <label
                  key={category.value}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    filters.categories.includes(category.value)
                      ? 'bg-primary/10 border-primary/20 border'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.value)}
                    onChange={() => handleCategoryToggle(category.value)}
                    className="text-primary"
                  />
                  <span className="text-sm">
                    {category.emoji} {category.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Ranges */}
          <div>
            <h4 className="font-medium mb-2">Price Range</h4>
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map(price => (
                <label
                  key={price.value}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    filters.priceRanges.includes(price.value)
                      ? 'bg-green-50 border-green-200 border'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.priceRanges.includes(price.value)}
                    onChange={() => handlePriceToggle(price.value)}
                    className="text-green-600"
                  />
                  <span className="text-sm">
                    {price.emoji} {price.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          {userLocation && (
            <div>
              <h4 className="font-medium mb-2">Distance from You</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={filters.maxDistance || 25}
                  onChange={(e) => onFiltersChange({ ...filters, maxDistance: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1km</span>
                  <span className="font-medium">
                    {filters.maxDistance ? `Within ${filters.maxDistance}km` : 'All distances'}
                  </span>
                  <span>50km</span>
                </div>
              </div>
            </div>
          )}

          {/* Availability */}
          <div>
            <h4 className="font-medium mb-2">Available Days</h4>
            <div className="flex flex-wrap gap-2">
              {availability.map(day => (
                <label
                  key={day.value}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                    filters.availability.includes(day.value)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.availability.includes(day.value)}
                    onChange={() => handleAvailabilityToggle(day.value)}
                    className="sr-only"
                  />
                  {day.label.slice(0, 3)}
                </label>
              ))}
            </div>
          </div>

          {/* Special Filters */}
          <div>
            <h4 className="font-medium mb-2">Special Options</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => onFiltersChange({ ...filters, featured: e.target.checked })}
                  className="text-yellow-600"
                />
                <span className="text-sm">Featured services only</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasContactInfo}
                  onChange={(e) => onFiltersChange({ ...filters, hasContactInfo: e.target.checked })}
                  className="text-primary"
                />
                <span className="text-sm">Has contact information</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
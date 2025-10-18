// src/components/AnalyticsDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { BarChart3Icon, TrendingUpIcon, UsersIcon, MapPinIcon, EyeIcon } from 'lucide-react';

interface AnalyticsData {
  totalServices: number;
  totalViews: number;
  popularCategories: Array<{
    category: string;
    count: number;
    emoji: string;
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    views: number;
    createdAt: string;
  }>;
  locationStats: {
    servicesWithLocation: number;
    averageDistance: number;
  };
}

import { ServiceTypeCard } from '@/types/service';
import { Location } from '@/types/props';

interface AnalyticsDashboardProps {
  services: ServiceTypeCard[];
  userLocation?: Location | null;
}

const AnalyticsDashboard = ({ services, userLocation }: AnalyticsDashboardProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (services.length === 0) return;

    // Calculate analytics from services data
    const categoryMap: Record<string, { count: number; emoji: string }> = {
      'accommodation': { count: 0, emoji: '🏠' },
      'surfing': { count: 0, emoji: '🏄‍♂️' },
      'tours': { count: 0, emoji: '🗺️' },
      'food': { count: 0, emoji: '🍽️' },
      'transport': { count: 0, emoji: '🚗' },
      'home': { count: 0, emoji: '🔧' },
      'beauty': { count: 0, emoji: '💆‍♀️' },
      'events': { count: 0, emoji: '🎉' },
      'other': { count: 0, emoji: '📋' }
    };

    let totalViews = 0;
    let servicesWithLocation = 0;
    let totalDistance = 0;
    let distanceCount = 0;

    services.forEach(service => {
      // Count categories
      if (service.category && categoryMap[service.category]) {
        categoryMap[service.category].count++;
      }

      // Sum views
      totalViews += service.views || 0;

      // Location stats
      if (service.location) {
        servicesWithLocation++;
        if (userLocation && service.distance) {
          totalDistance += service.distance;
          distanceCount++;
        }
      }
    });

    // Get top categories
    const popularCategories = Object.entries(categoryMap)
      .filter(([_, data]) => data.count > 0)
      .sort(([_, a], [__, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([category, data]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        count: data.count,
        emoji: data.emoji
      }));

    // Recent activity (top viewed services)
    const recentActivity = services
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map(service => ({
        id: service._id,
        title: service.title || 'Untitled Service',
        views: service.views || 0,
        createdAt: service._createdAt
      }));

    setAnalytics({
      totalServices: services.length,
      totalViews,
      popularCategories,
      recentActivity,
      locationStats: {
        servicesWithLocation,
        averageDistance: distanceCount > 0 ? totalDistance / distanceCount : 0
      }
    });
  }, [services, userLocation]);

  if (!analytics) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3Icon className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Platform Analytics</h3>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{analytics.totalServices}</div>
          <div className="text-sm text-blue-800">Total Services</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{analytics.totalViews.toLocaleString()}</div>
          <div className="text-sm text-green-800">Total Views</div>
        </div>
      </div>

      {/* Popular Categories */}
      <div>
        <h4 className="font-medium mb-2 flex items-center gap-1">
          <TrendingUpIcon className="w-4 h-4" />
          Popular Categories
        </h4>
        <div className="space-y-2">
          {analytics.popularCategories.map((cat, index) => (
            <div key={cat.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{cat.emoji}</span>
                <span className="text-sm">{cat.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ 
                      width: `${(cat.count / analytics.totalServices) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{cat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Stats */}
      {userLocation && (
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-1">
            <MapPinIcon className="w-4 h-4" />
            Location Stats
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Services with location:</span>
              <span className="font-medium">{analytics.locationStats.servicesWithLocation}</span>
            </div>
            {analytics.locationStats.averageDistance > 0 && (
              <div className="flex justify-between text-sm">
                <span>Average distance:</span>
                <span className="font-medium">
                  {analytics.locationStats.averageDistance.toFixed(1)}km
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Most Viewed Services */}
      <div>
        <h4 className="font-medium mb-2 flex items-center gap-1">
          <EyeIcon className="w-4 h-4" />
          Most Viewed
        </h4>
        <div className="space-y-2">
          {analytics.recentActivity.slice(0, 3).map((service, index) => (
            <div key={service.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {index + 1}
                </div>
                <span className="truncate max-w-32">{service.title}</span>
              </div>
              <span className="font-medium">{service.views} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
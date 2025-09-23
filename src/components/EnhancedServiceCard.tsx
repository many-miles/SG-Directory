// src/components/EnhancedServiceCard.tsx
"use client";

import { useState } from 'react';
import { cn, formatDate } from "../lib/utils";
import { EyeIcon, MapPinIcon, PhoneIcon, HeartIcon, ShareIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import DirectionsButton from "./DirectionsButton";
import { formatDistance } from "../lib/distance";
import { ServiceTypeCard } from "./ServiceCard";

interface EnhancedServiceCardProps {
  post: ServiceTypeCard;
  userLocation?: { lat: number; lng: number } | null;
  showDirections?: boolean;
  onSave?: (serviceId: string) => void;
  onShare?: (serviceId: string) => void;
  isSaved?: boolean;
}

const EnhancedServiceCard = ({ 
  post, 
  userLocation, 
  showDirections = true,
  onSave,
  onShare,
  isSaved = false
}: EnhancedServiceCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
    location,
    priceRange,
    serviceRadius,
    contactMethod,
    featured,
    distance
  } = post;

  const getPriceDisplay = (price: string | null) => {
    if (!price) return null;
    const priceMap: Record<string, string> = {
      'free': 'Free',
      'budget': 'R0 - R100',
      'moderate': 'R100 - R500',
      'premium': 'R500 - R1000',
      'luxury': 'R1000+',
      'quote': 'Contact for Quote'
    };
    return priceMap[price] || price;
  };

  const getPriceColor = (price: string | null) => {
    if (!price) return 'text-gray-500';
    const colorMap: Record<string, string> = {
      'free': 'text-green-600',
      'budget': 'text-blue-600',
      'moderate': 'text-yellow-600',
      'premium': 'text-orange-600',
      'luxury': 'text-purple-600',
      'quote': 'text-gray-600'
    };
    return colorMap[price] || 'text-gray-500';
  };

  const handleShare = async () => {
    const shareData = {
      title: title || 'Service in Jeffreys Bay',
      text: description || 'Check out this service in Jeffreys Bay',
      url: `${window.location.origin}/service/${_id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fall back to copying to clipboard
        navigator.clipboard.writeText(shareData.url);
        // Could add toast notification here
      }
    } else {
      // Fall back to copying to clipboard
      navigator.clipboard.writeText(shareData.url);
      // Could add toast notification here
    }
    
    onShare?.(_id);
  };

  const handleSave = () => {
    onSave?.(_id);
  };

  return (
    <article className={cn(
      "service-card group hover:shadow-lg transition-all duration-300",
      featured && "ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-white"
    )}>
      {featured && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg z-10">
          <StarIcon className="w-3 h-3 inline mr-1" />
          FEATURED
        </div>
      )}
      
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex-between">
          <div className="flex items-center gap-2">
            <p className="service-card_date">{formatDate(_createdAt)}</p>
            {category && (
              <span className="category-tag text-xs">
                {category.toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-black-100">
              <EyeIcon className="w-4 h-4" />
              <p className="text-sm">{views || 0}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSave}
                className={cn(
                  "p-1 h-8 w-8",
                  isSaved ? "text-red-500" : "text-gray-400 hover:text-red-500"
                )}
              >
                <HeartIcon className={cn("w-4 h-4", isSaved && "fill-current")} />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleShare}
                className="p-1 h-8 w-8 text-gray-400 hover:text-blue-500"
              >
                <ShareIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Link href={`/service/${_id}`} className="flex flex-col gap-4 group-hover:transform group-hover:scale-[1.02] transition-transform">
          {/* Image */}
          {image && !imageError && (
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={image}
                alt="service image"
                width={384}
                height={164}
                className="service-card_img group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
              
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          
          {/* Title and Description */}
          <div className="space-y-2">
            <h3 className="text-24-black line-clamp-1 group-hover:text-primary transition-colors">
              {title || 'Untitled Service'}
            </h3>
            
            {description && (
              <div>
                <p className={cn(
                  "service-card_desc text-gray-600",
                  !showFullDescription && "line-clamp-2"
                )}>
                  {description}
                </p>
                {description.length > 100 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowFullDescription(!showFullDescription);
                    }}
                    className="text-primary text-sm hover:underline mt-1"
                  >
                    {showFullDescription ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}
          </div>
        </Link>

        {/* Location and Price Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              <span>Jeffreys Bay</span>
              {distance !== undefined && (
                <span className="text-primary font-medium ml-1">
                  • {formatDistance(distance)}
                </span>
              )}
            </div>
            
            {priceRange && getPriceDisplay(priceRange) && (
              <div className={cn(
                "text-sm font-semibold px-2 py-1 rounded-full bg-gray-100",
                getPriceColor(priceRange)
              )}>
                {getPriceDisplay(priceRange)}
              </div>
            )}
          </div>

          {contactMethod && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <PhoneIcon className="w-4 h-4" />
              <span className="capitalize">{contactMethod} available</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Author Info */}
          <div className="flex items-center gap-2">
            {author?.image ? (
              <Image
                src={author.image}
                alt="user image"
                width={32}
                height={32}
                className="rounded-full border-2 border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">
                  {(author?.name || 'A')[0].toUpperCase()}
                </span>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-900">
                {author?.name || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-500">Service Provider</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              href={`/service/${_id}`}
              className="service-card_btn text-sm"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Directions (if location available and user location available) */}
        {showDirections && location && userLocation && (
          <div className="border-t border-gray-100 pt-3">
            <DirectionsButton
              serviceName={title || 'Service'}
              serviceLocation={{ lat: location.lat || 0, lng: location.lng || 0 }}
              userLocation={userLocation}
              distance={distance}
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default EnhancedServiceCard;
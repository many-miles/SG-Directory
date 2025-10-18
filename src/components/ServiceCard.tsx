"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { EyeIcon, MapPinIcon, PhoneIcon, HeartIcon, ShareIcon, StarIcon, RadiusIcon } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { formatDistance } from "@/lib/distance";
import { ServiceTypeCard } from "@/types/service";
import { useUser } from "@/context/UserContext";
import { Button } from "./ui/button";
import DirectionsButton from "./DirectionsButton";
import ErrorBoundary from "./ErrorBoundary";

interface ServiceCardProps {
  post: ServiceTypeCard;
}

const ServiceCard = ({ post }: ServiceCardProps) => {
  const { userLocation, isSaved, saveService, unsaveService, shareService } = useUser();
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isServiceSaved, setIsServiceSaved] = useState(isSaved(post._id));

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
    featured
  } = post;

  // Sync saved state with UserContext
  useEffect(() => {
    setIsServiceSaved(isSaved(_id));
  }, [_id, isSaved]);

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
        navigator.clipboard.writeText(shareData.url);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
    }
    
    await shareService(_id, title ?? undefined, description ?? undefined);
    toast.success("Link copied to clipboard!");
  };

  const handleSave = () => {
    if (isSaved(_id)) {
      unsaveService(_id);
      toast.success("Service removed from saved");
    } else {
      saveService(_id);
      toast.success("Service saved!");
    }
    setIsServiceSaved(!isServiceSaved);
  };

  const card = (
    <article className={cn(
      "service-card group hover:shadow-lg transition-all duration-300 relative bg-white border border-gray-200 rounded-lg p-4 h-full flex flex-col",
      featured && "ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-white"
    )}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-3 py-1.5 rounded-full border-2 border-white shadow-lg z-10 flex items-center gap-1">
          <StarIcon className="w-3 h-3" />
          FEATURED
        </div>
      )}
      
      <div className="flex flex-col gap-4 h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 min-h-[2rem]">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="service-card_date text-sm text-gray-500 whitespace-nowrap">
              {formatDate(_createdAt)}
            </p>
            {category && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 whitespace-nowrap">
                {category.toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap justify-end">
            <div className="flex items-center gap-1 text-gray-500">
              <EyeIcon className="w-4 h-4" />
              <p className="text-sm">{views || 0}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSave}
                className={cn(
                  "p-1 h-7 w-7 flex-shrink-0",
                  isServiceSaved ? "text-red-500" : "text-gray-400 hover:text-red-500"
                )}
              >
                <HeartIcon className={cn("w-3.5 h-3.5", isServiceSaved && "fill-current")} />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleShare}
                className="p-1 h-7 w-7 text-gray-400 hover:text-blue-500 flex-shrink-0"
              >
                <ShareIcon className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Link href={`/service/${_id}`} className="flex flex-col gap-4 group-hover:transform group-hover:scale-[1.01] transition-transform flex-grow">
          {/* Image */}
          {image && !imageError && (
            <div className="relative overflow-hidden rounded-lg aspect-video">
              <Image
                src={image}
                alt="service image"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          
          {/* Title and Description */}
          <div className="space-y-2 flex-grow">
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {title || 'Untitled Service'}
            </h3>
            
            {description && (
              <div>
                <p className={cn(
                  "text-sm text-gray-600",
                  !showFullDescription && "line-clamp-3"
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

        {/* Location and Service Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-gray-600 min-w-0">
              <MapPinIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Jeffreys Bay</span>
              {post.distance !== undefined && post.distance !== null && (
             <span className="text-primary font-medium whitespace-nowrap">
            • {formatDistance(post.distance)}
             </span>
            )}
            </div>
            
            {priceRange && getPriceDisplay(priceRange) && (
              <div className={cn(
                "text-xs font-medium px-2 py-1 rounded-full bg-gray-100 whitespace-nowrap",
                getPriceColor(priceRange)
              )}>
                {getPriceDisplay(priceRange)}
              </div>
            )}
          </div>

          {/* Service Radius */}
          {serviceRadius && (
            <div className="flex items-center gap-1 text-gray-600">
              <RadiusIcon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs">{serviceRadius}km service area</span>
            </div>
          )}

          {contactMethod && (
            <div className="flex items-center gap-1 text-gray-600">
              <PhoneIcon className="w-4 h-4 flex-shrink-0" />
              <span className="capitalize text-xs">{contactMethod} available</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          {/* Author Info */}
          <div className="flex items-center gap-2 min-w-0">
            {author?.image ? (
              <Image
                src={author.image}
                alt="user image"
                width={28}
                height={28}
                className="rounded-full border border-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 text-xs">
                  {(author?.name || 'A')[0].toUpperCase()}
                </span>
              </div>
            )}
            
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {author?.name || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-500">Service Provider</p>
            </div>
          </div>

          {/* View Details Button */}
          <Link
            href={`/service/${_id}`}
            className="bg-black text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-800 transition-colors whitespace-nowrap flex-shrink-0"
          >
            View Details
          </Link>
        </div>

        {/* Directions */}
        {location && userLocation && (
        <div className="border-t border-gray-100 pt-3 mt-2">
            <DirectionsButton
            serviceName={title || 'Service'}
            serviceLocation={{ lat: location.lat || 0, lng: location.lng || 0 }}
            userLocation={userLocation}
            // pass undefined when distance is nullish
            distance={post.distance ?? undefined}
             />
         </div>
        )}
      </div>
    </article>
  );

  return (
    <ErrorBoundary fallback={<p className="text-red-500">Error loading service</p>}>
      {card}
    </ErrorBoundary>
  );
};

export default ServiceCard;
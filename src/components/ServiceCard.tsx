// src/components/ServiceCard.tsx - Updated with new fields
import { cn, formatDate } from "../lib/utils";
import { EyeIcon, MapPinIcon, PhoneIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { Author, Service } from "../sanity/types";
import { Skeleton } from "../components/ui/skeleton";
import { formatDistance } from "../lib/distance";

export type ServiceTypeCard = {
  _id: string;
  title: string | null;
  slug?: any;
  _createdAt: string;
  author?: {
    _id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
  } | null;
  views: number | null;
  description: string | null;
  category: string | null;
  image: string | null;
  location?: {
    lat?: number;
    lng?: number;
    _type?: string;
  } | null; 
  priceRange?: string | null;
  serviceRadius?: number | null;
  contactMethod?: string | null;
  availability?: string[];
  featured?: boolean | null;
  // Optional fields for compatibility
  _type?: string;
  _updatedAt?: string;
  _rev?: string;
  // Distance field added by filtering
  distance?: number;
};

const ServiceCard = ({ post }: { post: ServiceTypeCard }) => {
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

  const getContactIcon = (method: string | null) => {
    if (!method) return <PhoneIcon className="w-3 h-3" />;
    switch(method) {
      case 'phone':
      case 'whatsapp':
        return <PhoneIcon className="w-3 h-3" />;
      default:
        return <PhoneIcon className="w-3 h-3" />;
    }
  };

  return (
    <article className={cn("service-card", featured && "border-yellow-400 bg-yellow-50/30")}>
      {featured && (
        <div className="featured-badge">
          ⭐ FEATURED
        </div>
      )}
      
      <div className="flex flex-col gap-4">
        <div className="flex-between">
          <p className="service-card_date">{formatDate(_createdAt)}</p>
          <div className="flex items-center gap-2 text-black-100">
            <EyeIcon className="w-4 h-4" />
            <p>{views || 0}</p>
          </div>
        </div>

        <Link href={`/service/${_id}`} className="flex flex-col gap-4">
          {image && (
            <Image
              src={image}
              alt="service image"
              width={384}
              height={164}
              className="service-card_img"
            />
          )}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-24-black line-clamp-1 flex-1">{title || 'Untitled Service'}</h3>
              {category && (
                <span className="category-tag text-xs">
                  {category.toUpperCase()}
                </span>
              )}
            </div>
            {description && (
              <p className="service-card_desc">{description}</p>
            )}
          </div>
        </Link>

        {/* Location and Price Info */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-1 text-black-300">
            <MapPinIcon className="w-3 h-3" />
            <span>Jeffreys Bay</span>
            {post.distance !== undefined && (
              <span className="text-primary font-medium ml-1">
                • {formatDistance(post.distance)}
              </span>
            )}
            {serviceRadius && !post.distance && (
              <span className="text-xs">• {serviceRadius}km radius</span>
            )}
          </div>
          
          {priceRange && getPriceDisplay(priceRange) && (
            <div className="flex items-center gap-1 text-black-300">
              <span className="font-medium">Price: {getPriceDisplay(priceRange)}</span>
            </div>
          )}
          
          {contactMethod && (
            <div className="flex items-center gap-1 text-black-300">
              {getContactIcon(contactMethod)}
              <span className="capitalize">{contactMethod}</span>
            </div>
          )}
        </div>

        <div className="flex-between">
          <div className="flex items-center gap-2">
            {author?.image ? (
              <Image
                src={author.image}
                alt="user image"
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <Image
                src="/default-avatar.png"
                alt="default avatar"
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <p className="text-16-medium">{author?.name || 'Anonymous'}</p>
          </div>

          <Link
            href={`/service/${_id}`}
            className="service-card_btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export const ServiceCardSkeleton = () => {
  return (
    <div className="service-card_skeleton">
      <Skeleton className="w-full h-full" />
    </div>
  );
};

export default ServiceCard;
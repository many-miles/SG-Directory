import { PortableTextBlock } from '@portabletext/types';

export interface ServiceTypeCard {
  _id: string;
  title: string | null;
  slug: { current: string } | null;
  _createdAt: string;
  author: ServiceAuthor | null;
  image: string | null;
  category: string | null;
  description: string | null;
  views: number | null;
  distance?: number | null;
  pitch: PortableTextBlock[] | null;
  location: ServiceLocation | null;
  priceRange: PriceRange | null;
  serviceRadius: number | null;
  availability: string[] | null;
  contactMethod: ContactMethod | null;
  contactDetails: string | null;
  isActive: boolean | null;
  featured?: boolean;
  _type?: "service";
  _updatedAt?: string;
  _rev?: string;
}

export type PriceRange = 'free' | 'budget' | 'moderate' | 'premium' | 'luxury' | 'quote';

export type ContactMethod = 'phone' | 'whatsapp' | 'email' | 'person';

export interface ServiceLocation {
  lat: number;
  lng: number;
}

export interface ServiceAuthor {
  _id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  bio: string | null;
}

// Helper type for map view
export interface MapService {
  _id: string;
  title: string | null;
  category: string | null;
  location: ServiceLocation;
  priceRange: PriceRange | null;
  author: ServiceAuthor | null;
}

// Type for service search/filter params
export interface ServiceSearchParams {
  query?: string;
  category?: string;
  priceRange?: PriceRange[];
  maxDistance?: number;
  availability?: string[];
  sortBy?: 'distance' | 'date' | 'views';
  hasContactInfo?: boolean;
}
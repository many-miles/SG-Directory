// src/sanity/lib/queries.ts - Updated with new fields
import { defineQuery } from "next-sanity";

export const SERVICES_QUERY =
  defineQuery(`*[_type == "service" && defined(slug.current) && isActive == true && (!defined($search) || title match $search || category match $search || author->name match $search) && (!defined($category) || category == $category)] | order(_createdAt desc) {
   _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, username, image, bio
    }, 
    views,
    description,
    category,
    image,
    location,
    serviceRadius,
    priceRange,
    contactMethod,
    contactDetails,
    availability,
    pitch,
    isActive,
    featured
}`);

export const SERVICE_BY_ID_QUERY =
  defineQuery(`*[_type == "service" && _id == $id][0]{
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  }, 
  views,
  description,
  category,
  image,
  location,
  serviceRadius,
  priceRange,
  contactMethod,
  contactDetails,
  availability,
  pitch,
  isActive,
  featured
}`);

export const SERVICES_BY_CATEGORY_QUERY =
  defineQuery(`*[_type == "service" && category == $category && isActive == true] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
  location,
  serviceRadius,
  priceRange,
  featured
}`);

export const FEATURED_SERVICES_QUERY =
  defineQuery(`*[_type == "service" && featured == true && isActive == true] | order(_createdAt desc)[0...6] {
    _id,
    title,
    slug,
    _createdAt,
    author -> {
      _id, name, username, image, bio
    },
    views,
    description,
    category,
    image,
    location,
    serviceRadius,
    priceRange,
    contactMethod,
    contactDetails,
    availability,
    pitch,
    isActive,
    featured
}`);

export type ServiceViewsResult = {
  _id: string;
  views: number;
};

export const SERVICE_VIEWS_QUERY = defineQuery(`
    *[_type == "service" && _id == $id][0]{
        _id, views
    }
`);

export const AUTHOR_BY_GOOGLE_ID_QUERY = defineQuery(`
*[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);

export const AUTHOR_BY_ID_QUERY = defineQuery(`
*[_type == "author" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);

export const SERVICES_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "service" && author._ref == $id] | order(_createdAt desc) {
  _id, 
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  title, 
  slug,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
  location,
  priceRange,
  isActive
}`);

export const PLAYLIST_BY_SLUG_QUERY =
  defineQuery(`*[_type == "playlist" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    slug,
    author->{
      _id,
      name,
      slug,
      image,
      bio
    },
    views,
    description,
    category,
    image,
    location,
    priceRange,
    pitch
  }
}`);
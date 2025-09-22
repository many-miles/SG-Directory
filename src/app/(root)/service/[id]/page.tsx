// src/app/(root)/service/[id]/page.tsx - Updated with new fields
import { Suspense } from "react";
import { client } from "../../../../sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  SERVICE_BY_ID_QUERY,
} from "../../../../sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "../../../../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from '@portabletext/react';
import { Skeleton } from "../../../../components/ui/skeleton";
import View from "../../../../components/View";
import ServiceCard, { ServiceTypeCard } from "../../../../components/ServiceCard";
import ServiceMap from "@/components/ServiceMap";
import { MapPinIcon, PhoneIcon, ClockIcon, DollarSignIcon, RadiusIcon, StarIcon } from "lucide-react";

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const [post, editorPicksData] = await Promise.all([
    client.fetch(SERVICE_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "featured-services",
    }),
  ]);

  if (!post) return notFound();

  const editorPosts = editorPicksData?.select || [];

  const getPriceDisplay = (price: string) => {
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

  const getContactDisplay = (method: string) => {
    const methodMap: Record<string, string> = {
      'phone': 'Phone',
      'whatsapp': 'WhatsApp',
      'email': 'Email',
      'person': 'In Person'
    };
    return methodMap[method] || method;
  };

  return (
    <>
      <section className="pink_container pattern!min-h-[230px]">
        <div className="flex items-center gap-2 mb-4">
          <p className="tag">{formatDate(post?._createdAt)}</p>
          {post.category && (
            <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
              {post.category}
            </span>
          )}
        </div>

        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        {post.image && (
          <img
            src={post.image}
            alt="service thumbnail"
            className="w-full h-auto max-h-96 object-cover rounded-xl"
          />
        )}

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5 flex-wrap">
            {post.author && (
              <Link
                href={`/user/${post.author._id}`}
                className="flex gap-2 items-center mb-3"
              >
                <Image
                  src={post.author.image || "/default-avatar.png"}
                  alt="avatar"
                  width={64}
                  height={64}
                  className="rounded-full drop-shadow-lg"
                />

                <div>
                  <p className="text-20-medium">{post.author.name}</p>
                  <p className="text-16-medium !text-black-300">
                    @{post.author.username}
                  </p>
                </div>
              </Link>
            )}

            <div className="flex flex-col gap-2">
              {post.priceRange && (
                <div className="flex items-center gap-2 text-16-medium">
                  <DollarSignIcon className="w-4 h-4" />
                  <span>{getPriceDisplay(post.priceRange)}</span>
                </div>
              )}
              
              {post.serviceRadius && (
                <div className="flex items-center gap-2 text-16-medium">
                  <RadiusIcon className="w-4 h-4" />
                  <span>{post.serviceRadius}km service radius</span>
                </div>
              )}
            </div>
          </div>

          {/* Service Information Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
            <div>
              <h4 className="text-18-semibold mb-3">Service Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-primary" />
                  <span className="font-medium">Jeffreys Bay, South Africa</span>
                </div>
                
                {post.serviceRadius && (
                  <div className="flex items-center gap-2 text-black-300">
                    <RadiusIcon className="w-5 h-5 text-primary" />
                    <span>Services within {post.serviceRadius}km radius</span>
                  </div>
                )}
                
                {post.contactMethod && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5 text-primary" />
                    <span>Preferred contact: {getContactDisplay(post.contactMethod)}</span>
                  </div>
                )}

                {post.contactDetails && (
                  <div className="mt-3 p-3 bg-white rounded-lg border-2 border-primary/20">
                    <p className="text-sm text-gray-600 mb-1">Contact Information:</p>
                    <p className="font-medium text-lg">{post.contactDetails}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-18-semibold mb-3">Quick Actions</h4>
              <div className="space-y-3">
                {post.contactDetails && (
                  <a 
                    href={post.contactMethod === 'whatsapp' 
                      ? `https://wa.me/${post.contactDetails.replace(/\D/g, '')}` 
                      : post.contactMethod === 'email' 
                      ? `mailto:${post.contactDetails}`
                      : `tel:${post.contactDetails}`}
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors text-center block font-medium"
                  >
                    Contact Provider
                  </a>
                )}
                <button className="w-full border-2 border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Save for Later
                </button>
                <button className="w-full border-2 border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Share Service
                </button>
              </div>
            </div>
          </div>

          {/* Location Map */}
          {post.location && (
            <div className="mt-8">
              <h3 className="text-30-bold mb-4">Service Location</h3>
              <ServiceMap 
                services={[{
                  _id: post._id,
                  title: post.title || 'Service',
                  category: post.category || 'other',
                  location: {
                    lat: post.location.lat || -34.0489,
                    lng: post.location.lng || 24.9087
                  },
                  priceRange: post.priceRange,
                  author: post.author
                }]}
                center={[post.location.lat || -34.0489, post.location.lng || 24.9087]}
                height="300px"
                zoom={15}
              />
            </div>
          )}

          <h3 className="text-30-bold">About This Service</h3>
          {post.pitch ? (
            <article className="prose max-w-4xl font-work-sans break-all">
              <PortableText value={post.pitch} />
            </article>
          ) : (
            <p className="no-result">No detailed information provided</p>
          )}
        </div>

        <hr className="divider" />

        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Similar Services</p>

            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: any, i: number) => (
                <ServiceCard key={i} post={post as ServiceTypeCard} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;
// src/app/(root)/service/[id]/page.tsx
import { Suspense } from "react";
import { client } from "../../../../sanity/lib/client";
import { PLAYLIST_BY_SLUG_QUERY, SERVICE_BY_ID_QUERY } from "../../../../sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "../../../../lib/utils";
import { PortableTextBlock } from '@portabletext/types';
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Skeleton } from "../../../../components/ui/skeleton";
import View from "../../../../components/View";
import ServiceCard from "@/components/ServiceCard";
import { ServiceTypeCard } from "../../../../types/service";
import { MapPinIcon, PhoneIcon, ClockIcon, DollarSignIcon, RadiusIcon, StarIcon } from "lucide-react";
import ServiceActionsWrapper from "@/components/ServiceActionsWrapper";
import ServiceMapWrapper from "@/components/ServiceMapWrapper";

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const [post, editorPicksData] = await Promise.all([
    client.fetch(SERVICE_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "featured-services" }),
  ]);

  if (!post) return notFound();

  const editorPosts = editorPicksData?.select || [];

  const getPriceDisplay = (price: string) => {
    const priceMap: Record<string, string> = {
      free: "Free",
      budget: "R0 - R100",
      moderate: "R100 - R500",
      premium: "R500 - R1000",
      luxury: "R1000+",
      quote: "Contact for Quote",
    };
    return priceMap[price] || price;
  };

  const getContactDisplay = (method: string) => {
    const methodMap: Record<string, string> = {
      phone: "Phone",
      whatsapp: "WhatsApp",
      email: "Email",
      person: "In Person",
    };
    return methodMap[method] || method;
  };

  return (
    <section>
      <section className="pink_container pattern !min-h-[230px]">
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
          <div className="flex flex-col md:flex-row justify-between gap-5">
            {post.author && (
              <Link href={`/user/${post.author._id}`} className="flex gap-2 items-center mb-3 md:mb-0">
                <Image
                  src={post.author.image || "/default-avatar.png"}
                  alt="avatar"
                  width={64}
                  height={64}
                  className="rounded-full drop-shadow-lg"
                />
                <div>
                  <p className="text-20-medium">{post.author.name}</p>
                  <p className="text-14-normal">View Profile</p>
                </div>
              </Link>
            )}

          <div className="flex flex-col gap-2 w-full md:w-64">
            <h4 className="text-18-semibold mb-1">Quick Actions</h4>
            {post.contactDetails && (
              <a
                href={
                  post.contactMethod === "whatsapp"
                    ? `https://wa.me/${post.contactDetails.replace(/\D/g, "")}`
                    : post.contactMethod === "email"
                    ? `mailto:${post.contactDetails}`
                    : `tel:${post.contactDetails}`
                }
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors text-center block font-medium mb-3"
              >
                Contact Provider
              </a>
            )}
            <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <ServiceActionsWrapper
            serviceId={post._id}
            title={post.title}
            description={post.description}
             />
              </Suspense>
           </div>
          </div>

          <div className="space-y-2">
            {post.priceRange && (
              <p className="flex items-center gap-2 text-16-medium">
                <DollarSignIcon className="size-5" />
                {getPriceDisplay(post.priceRange)}
              </p>
            )}
            {post.contactMethod && (
              <p className="flex items-center gap-2 text-16-medium">
                <PhoneIcon className="size-5" />
                {getContactDisplay(post.contactMethod)}
              </p>
            )}
            {post.availability && post.availability.length > 0 && (
              <p className="flex items-center gap-2 text-16-medium">
                <ClockIcon className="size-5" />
                {post.availability.join(", ")}
              </p>
            )}
            {post.serviceRadius && (
              <p className="flex items-center gap-2 text-16-medium">
                <RadiusIcon className="size-5" />
                {post.serviceRadius}km
              </p>
            )}
            {post.location && (
              <p className="flex items-center gap-2 text-16-medium">
                <MapPinIcon className="size-5" />
                {post.location.lat}, {post.location.lng}
              </p>
            )}
          {post.featured === true && (
          <p className="flex items-center gap-2 text-16-medium">
            <StarIcon className="size-5 text-yellow-500" />
            Featured Service
          </p>
        )}
          </div>

                    {post.location && (
            <div className="mt-8">
              <h3 className="text-30-bold mb-4">Service Location</h3>
              <ServiceMapWrapper
                services={[
                  {
                    _id: post._id,
                    title: post.title || "Service",
                    category: post.category || "other",
                    location: {
                      lat: post.location.lat || -34.0489,
                      lng: post.location.lng || 24.9087,
                    },
                    priceRange: post.priceRange,
                    author: post.author,
                  },
                ]}
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
          <div className="w-full flex flex-col items-center mt-10">
          <p className="text-30-semibold mb-6 text-center">Similar Services</p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl justify-items-center">
          {editorPosts.map((post, i: number) => {
            const servicePost: ServiceTypeCard = {
              _id: post._id || '',
              _createdAt: post._createdAt || '',
              title: post.title,
              slug: post.slug && post.slug.current ? { current: post.slug.current } : { current: '' },
              author: post.author ? {
                _id: post.author._id,
                name: post.author.name,
                username: post.author.slug || null,
                image: post.author.image,
                bio: post.author.bio
              } : null,
              image: post.image,
              category: post.category,
              description: post.description,
              views: post.views || 0,
              pitch: post.pitch ? post.pitch as PortableTextBlock[] : null,
              location: post.location ? {
                lat: Number(post.location.lat),
                lng: Number(post.location.lng)
              } : null,
              priceRange: post.priceRange,
              serviceRadius: 10,
              availability: [],
              contactMethod: null,
              contactDetails: null,
              isActive: true
            };
            return <ServiceCard key={i} post={servicePost} />;
          })}
          </ul>
        </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </section>
  );
};

export default Page;
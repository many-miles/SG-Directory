// src/app/(root)/page.tsx
import SearchForm from "@/components/SearchForm";
import ServiceCard from "@/components/ServiceCard";
import { ServiceTypeCard } from "@/types/service";
import { SERVICES_QUERY, FEATURED_SERVICES_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "../../../auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string }>;
}) {
  const query = (await searchParams).query;
  const category = (await searchParams).category;
  const params = { search: query || null, category: category || null };

  const session = await auth();

  // Fetch regular services and featured services
  const { data: posts } = await sanityFetch({ query: SERVICES_QUERY, params });
  const { data: featuredPosts } = await sanityFetch({ query: FEATURED_SERVICES_QUERY, params: {} });

    const normalizedPosts: ServiceTypeCard[] = (posts || []).map((post: ServiceTypeCard) => ({
  ...post,
  slug: post.slug?.current ? { current: post.slug.current } : null
}));

const normalizedFeatured: ServiceTypeCard[] = (featuredPosts || []).map((post: ServiceTypeCard) => ({
  ...post,
  slug: post.slug?.current ? { current: post.slug.current } : null
}));

  return (
    <>
      <section className="pink_container pattern">
        <div className="text-center w-full">
          <h1 className="heading mx-auto">
            Find Local Services in <br />
            Jeffreys Bay
          </h1>

          <p className="sub-heading !max-w-3xl mx-auto">
            Connect with trusted local service providers in your community.
            From surfing lessons to home repairs, find what you need nearby.
          </p>

          <SearchForm query={query} />

          <p className="small-heading !max-w-3xl mx-auto">
            Serving the surfing capital of South Africa since 2024
          </p>
        </div>
      </section>

      {/* Featured Services Section */}
      {featuredPosts?.length > 0 && !query && (
        <section className="section_container">
          <div className="flex-between mt-4">
            <p className="text-30-semibold">Featured Services</p>
            <p className="text-16-medium text-black-300">
              Popular in Jeffreys Bay
            </p>
          </div>

          <ul className="card_grid mt-4">
          {normalizedFeatured.map(post => (
         <ServiceCard key={post._id} post={post} />
           ))}
          </ul>
        </section>
      )}

      {/* Categories Section */}
      {!query && (
        <section className="section_container service-section">
          <p className="text-30-semibold">Browse by Category</p>

          <div className="category-grid mt-4">
            {[
              { name: "Surfing Lessons", value: "surfing", emoji: "🏄‍♂️" },
              { name: "Accommodation", value: "accommodation", emoji: "🏠" },
              { name: "Tours & Activities", value: "tours", emoji: "🗺️" },
              { name: "Food & Catering", value: "food", emoji: "🍽️" },
              { name: "Transport", value: "transport", emoji: "🚗" },
              { name: "Home Services", value: "home", emoji: "🔧" },
              { name: "Beauty & Wellness", value: "beauty", emoji: "💆‍♀️" },
              { name: "Events", value: "events", emoji: "🎉" },
            ].map((cat) => (
              <a
                key={cat.value}
                href={`/?category=${cat.value}`}
                className="category-card flex flex-col items-center justify-center text-center p-4 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow"
              >
                <span className="category-emoji text-4xl mb-2">{cat.emoji}</span>
                <p className="text-16-medium font-semibold">{cat.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="section_container">
        <div className="flex flex-wrap items-center justify-between">
          <p className="text-30-semibold">
            {query
              ? `Search results for "${query}"`
              : category
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Services`
              : "All Services"}
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/near-me"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
            >
              Near Me
            </a>
            <a
              href="/map"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
            >
              View Map
            </a>
          </div>
        </div>

        <ul className="card_grid mt-4">
        {normalizedPosts.length > 0 ? (
         normalizedPosts.map(post => (
        <ServiceCard key={post._id} post={post} />
    ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="no-results text-xl mb-2">No services found</p>
              <p className="text-black-300">
                {query || category
                  ? "Try adjusting your search or browse all services"
                  : "Be the first to list a service in Jeffreys Bay!"}
              </p>
              {session && (
                <a
                  href="/service/create"
                  className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  List Your Service
                </a>
              )}
            </div>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
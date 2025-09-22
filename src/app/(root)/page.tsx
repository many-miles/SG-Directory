// src/app/(root)/page.tsx - Updated for Jeffreys Bay theme
import SearchForm from "@/components/SearchForm";
import ServiceCard, { ServiceTypeCard } from "@/components/ServiceCard";
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
              🌊 Serving the surfing capital of South Africa since 2024
            </p>
        </div>
      </section>

      {/* Featured Services Section */}
      {featuredPosts?.length > 0 && !query && (
        <section className="section_container">
          <div className="flex-between">
            <p className="text-30-semibold">Featured Services</p>
            <p className="text-16-medium text-black-300">
              Popular in Jeffreys Bay
            </p>
          </div>

          <ul className="mt-7 card_grid">
            {featuredPosts.map((post: ServiceTypeCard) => (
              <ServiceCard key={post?._id} post={post} />
            ))}
          </ul>
        </section>
      )}

      {/* Categories Section */}
      {!query && (
        <section className="section_container service-section">
          <p className="text-30-semibold mb-7">Browse by Category</p>
          
          <div className="category-grid">
            {[
              { name: "Surfing Lessons", value: "surfing", emoji: "🏄‍♂️" },
              { name: "Accommodation", value: "accommodation", emoji: "🏠" },
              { name: "Tours & Activities", value: "tours", emoji: "🗺️" },
              { name: "Food & Catering", value: "food", emoji: "🍽️" },
              { name: "Transport", value: "transport", emoji: "🚗" },
              { name: "Home Services", value: "home", emoji: "🔧" },
              { name: "Beauty & Wellness", value: "beauty", emoji: "💆‍♀️" },
              { name: "Events", value: "events", emoji: "🎉" }
            ].map((cat) => (
              <a
                key={cat.value}
                href={`/?category=${cat.value}`}
                className="category-card"
              >
                <span className="category-emoji">{cat.emoji}</span>
                <p className="text-16-medium font-semibold">{cat.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="section_container">
        <div className="flex-between mb-4">
          <p className="text-30-semibold">
            {query ? `Search results for "${query}"` : 
             category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Services` : 
             "All Services"}
          </p>
          <div className="flex gap-3">
            <a 
              href="/near-me" 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              🎯 Near Me
            </a>
            <a 
              href="/map" 
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              📍 View Map
            </a>
          </div>
        </div>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: any) => (
              <ServiceCard key={post?._id} post={post as ServiceTypeCard} />
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
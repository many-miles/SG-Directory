import SearchForm from "../../components/SearchForm";
import StartupCard, { StartupTypeCard } from "../../components/StartupCard";
import { STARTUPS_QUERY } from "../../sanity/lib/queries";
import { sanityFetch, SanityLive } from "../../sanity/lib/live";
import { auth } from "../../../auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const session = await auth();

  console.log(session?.user?.id || session?.user?.email);

  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  return (
    <>
      <section className="pink_container relative overflow-hidden">
        <div className="pattern absolute inset-0 opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"></div>
          <h1 className="heading inline-block">
            Pitch Your Startup, <br className="hidden sm:block" />
            Connect With Entrepreneurs
          </h1>

          <p className="sub-heading max-w-3xl mx-auto mt-6 text-white/90">
            Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: any) => (
              <StartupCard key={post?._id} post={post as StartupTypeCard} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
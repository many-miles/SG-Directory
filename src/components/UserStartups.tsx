import React from "react";
import { client } from "../sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "../sanity/lib/queries";
import StartupCard, { StartupTypeCard } from "../components/StartupCard";
import { Startup } from "../sanity/types";

const UserStartups = async ({ id }: { id: string }) => {
  const startups = await client.fetch<Array<Startup>>(STARTUPS_BY_AUTHOR_QUERY, { id });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {startups?.length > 0 ? (
        startups.map((startup) => (
          <StartupCard key={startup._id} post={startup as StartupTypeCard} />
        ))
      ) : (
        <p className="no-result text-center py-8">No startups yet</p>
      )}
    </div>
  );
};
export default UserStartups;
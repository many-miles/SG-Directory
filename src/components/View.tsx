import Ping from "../components/Ping";
import { client } from "../sanity/lib/client";
import { STARTUP_VIEWS_QUERY, type StartupViewsResult } from "../sanity/lib/queries";
import { writeClient } from "../sanity/lib/write-client";
import { after } from "next/server";

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
  .withConfig({ useCdn: false })
   .fetch<StartupViewsResult>(STARTUP_VIEWS_QUERY, { id });

 after(async () => {
    try {
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit();
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }
  });

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
};
export default View;
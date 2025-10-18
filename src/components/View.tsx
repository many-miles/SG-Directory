// src/components/View.tsx - Fixed positioning and styling
import Ping from "../components/Ping";
import { client } from "../sanity/lib/client";
import { SERVICE_VIEWS_QUERY, type ServiceViewsResult } from "../sanity/lib/queries";
import { writeClient } from "../sanity/lib/write-client";
import { after } from "next/server";

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch<ServiceViewsResult>(SERVICE_VIEWS_QUERY, { id });

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
    <div className="fixed bottom-20 right-4 z-50">
      <div className="relative bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-lg">
        {/* Ping positioned in top-right corner of the view container */}
        <div className="absolute -top-1 -right-1">
          <Ping />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <p className="text-sm font-medium text-gray-700">
            <span className="font-bold text-primary">{totalViews}</span> views
          </p>
        </div>
      </div>
    </div>
  );
};
export default View;
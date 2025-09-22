// src/app/(root)/map/page.tsx
import { client } from "../../../sanity/lib/client";
import { defineQuery } from "next-sanity";
import ServiceMap from "@/components/ServiceMap";

const SERVICES_WITH_LOCATION_QUERY = defineQuery(`
  *[_type == "service" && defined(location) && isActive == true] | order(_createdAt desc) {
    _id,
    title,
    category,
    location,
    priceRange,
    author -> {
      name
    }
  }
`);

export default async function MapPage() {
  const services = await client.fetch(SERVICES_WITH_LOCATION_QUERY);

   const normalizedServices = services.map((s: any) => ({
    ...s,
    title: s.title ?? "",
    category: s.category ?? "other",
  }));

  return (
    <>
      <section className="pink_container pattern !min-h-[200px]">
        <h1 className="heading">Service Map</h1>
        <p className="sub-heading">
          Explore all services in Jeffreys Bay on the interactive map
        </p>
      </section>

      <section className="section_container">
        <div className="mb-6">
          <div className="flex-between mb-4">
            <h2 className="text-30-semibold">
              {services.length} Services Found
            </h2>
            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Service Location</span>
              </div>
            </div>
          </div>

          <ServiceMap 
          services={normalizedServices}
          height="500px"
          zoom={12}
        />
        </div>

        {/* Service Categories Legend */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
  { name: "Surfing", emoji: "🏄‍♂️", count: normalizedServices.filter(s => s.category === 'surfing').length },
  { name: "Accommodation", emoji: "🏠", count: normalizedServices.filter(s => s.category === 'accommodation').length },
  { name: "Tours", emoji: "🗺️", count: normalizedServices.filter(s => s.category === 'tours').length },
  { name: "Food", emoji: "🍽️", count: normalizedServices.filter(s => s.category === 'food').length },
].map((cat) => (
  <div key={cat.name} className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
    <div className="text-2xl mb-2">{cat.emoji}</div>
    <p className="font-semibold">{cat.count} {cat.name}</p>
    <p className="text-sm text-gray-500">services</p>
  </div>
))}
        </div>
      </section>
    </>
  );
}
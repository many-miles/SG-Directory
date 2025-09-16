import React from "react";
import { client } from "../sanity/lib/client";
import { SERVICES_BY_AUTHOR_QUERY } from "../sanity/lib/queries";
import ServiceCard, { ServiceTypeCard } from "../components/ServiceCard";
import { Service } from "../sanity/types";

const UserServices = async ({ id }: { id: string }) => {
  const services = await client.fetch<Array<Service>>(SERVICES_BY_AUTHOR_QUERY, { id });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services?.length > 0 ? (
        services.map((service) => (
          <ServiceCard key={service._id} post={service as ServiceTypeCard} />
        ))
      ) : (
        <p className="no-result text-center py-8">No services yet</p>
      )}
    </div>
  );
};
export default UserServices;
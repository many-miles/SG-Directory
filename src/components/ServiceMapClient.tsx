"use client";

import dynamic from "next/dynamic";
import { MapService } from "@/types/service";

// Dynamically import your Leaflet map only on the client
const ServiceMap = dynamic(() => import("@/components/ServiceMap"), {
  ssr: false,
});

interface Props {
  services: MapService[];
  height?: string;
  zoom?: number;
}

export default function ServiceMapClient({ services, height = "500px", zoom = 12 }: Props) {
  return <ServiceMap services={services} height={height} zoom={zoom} />;
}

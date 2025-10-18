"use server";

import { auth } from "../../auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

interface FormState {
  error?: string;
  status?: string;
}

export const createPitch = async (
  state: FormState,
  form: FormData,
  pitch: string,
  location: { lat: number; lng: number }
) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  const { 
    title, 
    description, 
    category, 
    link, 
    priceRange,
    contactMethod,
    contactDetails,
    serviceRadius
  } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch"),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    // Convert pitch string to Sanity block content
    const pitchBlocks = pitch ? [
      {
        _type: 'block',
        _key: Math.random().toString(36).substr(2, 9),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: Math.random().toString(36).substr(2, 9),
            text: pitch,
            marks: []
          }
        ],
        markDefs: []
      }
    ] : [];

    const service = {
      title,
      description,
      category,
      image: link || null,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch: pitchBlocks,
      priceRange: priceRange || null,
      contactMethod: contactMethod || null,
      contactDetails: contactDetails || null,
      serviceRadius: serviceRadius ? parseInt(serviceRadius as string) : 5,
      // Use the location from the map picker
      location: {
        _type: "geopoint",
        lat: location.lat,
        lng: location.lng
      },
      isActive: true,
      featured: false,
      views: 0
    };

    const result = await writeClient.create({ _type: "service", ...service });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
import "server-only";

import { defineLive } from "next-sanity/live";
import { client } from "../../sanity/lib/client";
import { token } from "../env";

export const { sanityFetch, SanityLive } = defineLive({ 
  client,
  serverToken: token,
  browserToken: false, // Set to false to silence the warning since we don't need browser previews
});
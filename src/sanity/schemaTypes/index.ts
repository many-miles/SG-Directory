import { type SchemaTypeDefinition } from "sanity";

import { author } from "../../sanity/schemaTypes/author";
import { service } from "../../sanity/schemaTypes/service";
import { playlist } from "../../sanity/schemaTypes/playlist";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, service, playlist],
};
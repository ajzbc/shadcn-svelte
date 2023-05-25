import { error } from "@sveltejs/kit";

import type { DocResolver } from "$lib/types/docs";
import { slugFromPath } from "$lib/utils";

import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {
  // there's definitely a better way to do this for the index page
  // but I'll sort this out later - works for now :)
  const modules = import.meta.glob(`/src/content/**/index.md`);

  let match: { path?: string; resolver?: DocResolver } = {};

  for (const [path, resolver] of Object.entries(modules)) {
    console.log(slugFromPath(path));
    if (slugFromPath(path) === "index") {
      match = { path, resolver: resolver as unknown as DocResolver };
      break;
    }
  }

  const doc = await match?.resolver?.();

  if (!doc || !doc.metadata) {
    throw error(404);
  }
  return {
    component: doc.default,
    metadata: doc.metadata
  };
};
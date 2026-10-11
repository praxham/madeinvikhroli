import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types";
import Hero from "~/components/home/hero";
import type { CacheEntry } from "~/types/common";
import { CACHE_TTL } from "~/constatns";
import { apiClient } from "~/api/axios";

export function meta({}: Route.MetaArgs) {
  const title = "Made In Vikhorli";
  const description =
    "A creative collective and marketplace for buying and selling art, websites & tech services from Vikhroli.";
  const image =
    "https://assets.madeinvikhroli.com/website-assets/miv-website-preview.png";
  return [
    { title: title },
    {
      name: "description",
      content: description,
    },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:type", content: "website" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}

export const loader = async () => {
  const artifacts = await getArtifacts();
  return { artifacts: artifacts || [] };
};

export default function Home() {
  const { artifacts } = useLoaderData();
  return (
    <div className="max-w-[1240px] mx-auto">
      <Hero artifacts={artifacts} />
    </div>
  );
}

const artifactCache = new Map<string, CacheEntry>();

const getArtifacts = async () => {
  try {
    const cacheKey = `homepage_artifacts`;
    const now = Date.now();
    const cached = artifactCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    const response = await apiClient("/artifact/?toShowOn=homepage&limit=6");
    const data = response?.data?.data;
    artifactCache.set(cacheKey, {
      data,
      timestamp: now,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types";
import Hero from "~/components/home/hero";
import type { CacheEntry } from "~/types/common";
import { CACHE_TTL } from "~/constatns";
import { apiClient } from "~/api/axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Made In Vikhorli" },
    {
      name: "description",
      content: "We’re a collective making art, websites & everything tech",
    },
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

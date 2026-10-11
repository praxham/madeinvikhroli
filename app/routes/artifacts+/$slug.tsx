import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { apiClient } from "~/api/axios";
import ArtifactDetailedCard from "~/components/artifacts/artifactDetailedCard";
import CommonErrorBoundary from "~/components/common/commonErrorBoundary";
import { CACHE_TTL } from "~/constatns";
import type { CacheEntry, DetailedArtifact } from "~/types/common";
import { getArtifactsOfMember } from "../members+/$username";
import type { Route } from "../+types";

export function meta({ loaderData }: Route.MetaArgs) {
  const data = loaderData as unknown as
    | { artifact: DetailedArtifact }
    | undefined;

  if (!data?.artifact) {
    return [
      { title: "Artifact Not Found" },
      {
        name: "description",
        content: "The requested artifact could not be found.",
      },
    ];
  }

  const { artifact } = data;
  const title = artifact.title || "Artifact Details";
  const description = `from ${artifact.artist?.username || "artist"} for ₹${artifact.amount}`;
  const image = artifact.images?.[0] || "";

  return [
    { title },
    { name: "description", content: description },

    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:type", content: "website" },

    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const slug = url.pathname.replace("/artifacts/", "");

  const artifact = await getArtifactBySlug({ slug });

  const artifactsOfMember = await getArtifactsOfMember({
    page: 1,
    limit: 6,
    artist: artifact.artist.id,
    ignoreCache: false,
  });

  return {
    artifact: artifact || null,
    artifactsOfMember: artifactsOfMember || [],
  };
};

const ArtifactDetail = () => {
  const { artifact, artifactsOfMember } = useLoaderData();

  return (
    <ArtifactDetailedCard
      artifact={artifact}
      artifactsOfMember={artifactsOfMember}
    />
  );
};

export const ErrorBoundary = CommonErrorBoundary;

const artifactCache = new Map<string, CacheEntry>();

export const getArtifactBySlug = async ({
  slug,
  forArtist,
  ignoreCache = false,
  toShowOn = "detailed",
}: {
  slug: string;
  forArtist?: string | null;
  ignoreCache?: boolean;
  toShowOn?: "detailed" | "dashboard_detailed";
}) => {
  if (!slug || slug.length === 0) {
    console.error("slug is requried to fetch artifact");
    return;
  }
  const cacheKey = `artifact-${slug}`;
  const now = Date.now();
  const cached = artifactCache.get(cacheKey);
  if (!ignoreCache && cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  try {
    const response = await apiClient.get(
      `/artifact/?toShowOn=${toShowOn}&${forArtist ? `forArtist=${forArtist}&` : ""}slug=${slug}`,
    );
    const artifact = response?.data?.data?.[0];
    const parsedData = {
      ...artifact,
      images: JSON.parse(artifact.images),
      category: JSON.parse(artifact.category),
      artist: JSON.parse(artifact.artist),
      deliverable_file_formats: JSON.parse(artifact.deliverable_file_formats),
    };
    if (!ignoreCache) {
      artifactCache.set(cacheKey, {
        data: parsedData,
        timestamp: now,
      });
    }

    return parsedData;
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to fetch artifact";
    throw new Error(errorMessage);
  }
};

export default ArtifactDetail;

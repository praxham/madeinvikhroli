import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types";
import { apiClient } from "~/api/axios";
import ArtifactsGrid from "~/components/artifacts/artifactsGrid";
import type { CacheEntry } from "~/types/common";
import { CACHE_TTL } from "~/constatns";
import CommonErrorBoundary from "~/components/common/commonErrorBoundary";
import NoContent from "~/components/common/noContent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Artifacts" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;

  const artifacts = await getArtifacts({ page, limit: limit });

  const hasNextPage = artifacts?.length > limit;

  return { artifacts: artifacts || [], page, limit, hasNextPage };
};

const Index = () => {
  const { artifacts, page, limit, hasNextPage } = useLoaderData();

  if (artifacts.length === 0) {
    return <NoContent title="Artifacts" />;
  }
  return (
    <ArtifactsGrid
      artifacts={artifacts}
      currentPage={page}
      limit={limit}
      hasNextPage={hasNextPage}
    />
  );
};

export const ErrorBoundary = CommonErrorBoundary;

const artifactCache = new Map<string, CacheEntry>();

const getArtifacts = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const cacheKey = `artifacts_page_${page}_limit_${limit}`;
  const now = Date.now();
  const cached = artifactCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  try {
    const response = await apiClient.get(
      `/artifact/?toShowOn=grid_view&page=${page}&limit=${limit}`,
    );
    const parsedData = response?.data?.data?.map((artifact: any) => ({
      ...artifact,
      images: JSON.parse(artifact.images),
    }));
    artifactCache.set(cacheKey, {
      data: parsedData,
      timestamp: now,
    });

    return parsedData;
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to fetch artifacts";
    throw new Error(errorMessage);
  }
};

export default Index;

import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types";
import { apiClient } from "~/api/axios";
import type { CacheEntry } from "~/types/common";
import { CACHE_TTL } from "~/constatns";
import CommonErrorBoundary from "~/components/common/commonErrorBoundary";
import MembersGrid from "~/components/members/membersGrid";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Members" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;

  const members = await getMembers({ page, limit });

  const hasNextPage = members?.length > limit;

  return { members: members || [], page, limit, hasNextPage };
};

const Index = () => {
  const { members, page, limit, hasNextPage } = useLoaderData();

  return (
    <MembersGrid
      members={members}
      currentPage={page}
      limit={limit}
      hasNextPage={hasNextPage}
    />
  );
};

export const ErrorBoundary = CommonErrorBoundary;

const membersCache = new Map<string, CacheEntry>();

const getMembers = async ({ page, limit }: { page: number; limit: number }) => {
  const cacheKey = `members_page_${page}_limit_${limit}`;
  const now = Date.now();
  const cached = membersCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  try {
    const response = await apiClient.get(
      `/artist/?toShowOn=grid_view&page=${page}&limit=${limit}`,
    );
    const members = response?.data?.data;
    membersCache.set(cacheKey, {
      data: members,
      timestamp: now,
    });

    return members;
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to fetch members";
    throw new Error(errorMessage);
  }
};

export default Index;

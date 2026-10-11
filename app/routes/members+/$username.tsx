import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { apiClient } from "~/api/axios";
import ArtifactsGrid from "~/components/artifacts/artifactsGrid";
import CommonErrorBoundary from "~/components/common/commonErrorBoundary";
import NoContent from "~/components/common/noContent";
import MemberDetailedCard from "~/components/members/memberDetailedCard";
import { CACHE_TTL } from "~/constatns";
import type { CacheEntry, DetailedMember } from "~/types/common";
import type { Route } from "../+types";

export function meta({ loaderData }: Route.MetaArgs) {
  const data = loaderData as unknown as { member: DetailedMember } | undefined;

  if (!data?.member) {
    return [
      { title: "Member Not Found" },
      {
        name: "description",
        content: "The requested member could not be found.",
      },
    ];
  }

  const { member } = data;
  const title = member.username || "Member Details";
  const words = member.description.trim().split(/\s+/);
  const description =
    words.length > 20
      ? words.slice(0, 20).join(" ") + "..."
      : member.description;
  const image = member.profile_photo || "";

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
  const username = url.pathname.replace("/members/", "");
  const artifactsLimit = 6;

  const member = await getMemeber({ username });
  let artifacts: any[] = [];
  if (member.id) {
    artifacts = await getArtifactsOfMember({
      page: 1,
      limit: artifactsLimit,
      artist: member.id,
      ignoreCache: false,
    });
  }

  return { member: member || null, artifacts: artifacts, artifactsLimit };
};

const MemberDetail = () => {
  const { member, artifacts, artifactsLimit } = useLoaderData();

  return (
    <div className="flex flex-col gap-4">
      <MemberDetailedCard member={member} />
      <h1 className="heading1">Artifacts</h1>
      {artifacts?.length > 0 ? (
        <ArtifactsGrid
          artifacts={artifacts}
          currentPage={1}
          limit={artifactsLimit}
          hasNextPage={false}
        />
      ) : (
        <NoContent title="Artifacts" />
      )}
    </div>
  );
};

export const ErrorBoundary = CommonErrorBoundary;

const memberCache = new Map<string, CacheEntry>();
const membersArtifactsCache = new Map<string, CacheEntry>();

const getMemeber = async ({ username }: { username: string }) => {
  const cacheKey = `member-${username}`;
  const now = Date.now();
  const cached = memberCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  try {
    const response = await apiClient.get(`/artist/?username=${username}`);
    const member = response?.data?.data?.[0];
    const parsedData = {
      ...member,
      socials: JSON.parse(member.socials),
    };
    memberCache.set(cacheKey, {
      data: parsedData,
      timestamp: now,
    });

    return parsedData;
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to fetch member";
    throw new Error(errorMessage);
  }
};

export const getArtifactsOfMember = async ({
  page,
  limit,
  artist,
  ignoreCache = false,
  toShowOn = "grid_view",
}: {
  page: number;
  limit: number;
  artist: string | null;
  ignoreCache?: boolean;
  toShowOn?: "grid_view" | "dashboard_grid_view" | "dashboard_detailed";
}) => {
  const cacheKey = `artifacts_page_${page}_limit_${limit}`;
  const now = Date.now();
  const cached = membersArtifactsCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL && !ignoreCache) {
    return cached.data;
  }
  try {
    const response = await apiClient.get(
      `/artifact/?toShowOn=${toShowOn}&${artist ? `artist=${artist}&` : ""}page=${page}&limit=${limit}`,
    );

    const parsedData = response?.data?.data?.map((artifact: any) => ({
      ...artifact,
      images: JSON.parse(artifact.images),
    }));
    if (!ignoreCache) {
      membersArtifactsCache.set(cacheKey, {
        data: parsedData,
        timestamp: now,
      });
    }
    return parsedData;
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to fetch artifacts";
    throw new Error(errorMessage);
  }
};

export default MemberDetail;

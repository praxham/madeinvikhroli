import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import ArtifactForm from "~/components/artifacts/artifactForm";
import CommonErrorBoundary from "~/components/common/commonErrorBoundary";
import { getServerCookieData } from "~/functions";
import { getArtifactBySlug } from "~/routes/artifacts+/$slug";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") || "";
  const token = getServerCookieData(request, "authToken");

  const artifact = await getArtifactBySlug({
    slug,
    forArtist: token,
    ignoreCache: !!token,
    toShowOn: "dashboard_detailed",
  });

  return { artifact: artifact };
};

const EditArtifact = () => {
  const { artifact } = useLoaderData();

  return <ArtifactForm artifact={artifact} />;
};

export const ErrorBoundary = CommonErrorBoundary;

export default EditArtifact;

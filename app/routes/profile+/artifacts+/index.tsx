import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
  type LoaderFunctionArgs,
} from "react-router";
import ArtifactsGrid from "~/components/artifacts/artifactsGrid";
import NoContent from "~/components/common/noContent";
import CommonErrorBoundary from "~/components/common/commonErrorBoundary";
import StyledButton from "~/components/common/styledButton";
import { getArtifactsOfMember } from "~/routes/members+/$username";
import { getServerCookieData } from "~/functions";
import DialogueBox from "~/components/common/dialogueBox";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;
  const token = getServerCookieData(request, "authToken");

  const artifacts = await getArtifactsOfMember({
    page,
    limit,
    artist: token,
    ignoreCache: true,
    toShowOn: "dashboard_grid_view",
  });

  const hasNextPage = artifacts?.length > limit;

  return { artifacts: artifacts || [], page, limit, hasNextPage };
};

const Artifacts = () => {
  const { artifacts, page, limit, hasNextPage } = useLoaderData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<any>();
  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";

  useEffect(() => {
    if (!fetcher.data) return;

    if (fetcher.data.success && fetcher.data.intent === "delete_artifact") {
      toast.success("Artifact Deleted Successfully!");
      setSearchParams((prevParams) => {
        prevParams.delete("delete");
        return prevParams;
      });
    } else if (fetcher.data.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  const handleDelete = (id: string) => {
    const customFormData = new FormData();
    customFormData.append("id", id);
    customFormData.append("intent", "delete_artifact");
    fetcher.submit(customFormData, {
      method: "DELETE",
      action: "/profile",
      encType: "multipart/form-data",
    });
  };

  if (artifacts.length === 0) {
    return <NoContent title="Artifacts" />;
  }
  return (
    <div className="my-[1.5rem] relative">
      <ArtifactsGrid
        artifacts={artifacts}
        currentPage={page}
        limit={limit}
        hasNextPage={hasNextPage}
      />
      <StyledButton
        title="Create Artifact"
        heirarchy="primary"
        action={() => navigate("create")}
        style={{ position: "absolute", right: 0, top: "-64px" }}
      />
      {searchParams.get("delete") && (
        <DialogueBox
          title="Delete Artifact"
          subtitle="are u sure, its an unereversable action"
          handleClose={() =>
            setSearchParams((prevParams) => {
              prevParams.delete("delete");
              return prevParams;
            })
          }
          confirmFunction={() =>
            handleDelete(searchParams.get("delete") as string)
          }
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export const ErrorBoundary = CommonErrorBoundary;

export default Artifacts;

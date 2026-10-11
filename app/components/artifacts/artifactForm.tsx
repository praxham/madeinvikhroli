import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useFetcher, useNavigate } from "react-router";
import type { DetailedArtifact, GridArtifact } from "~/types/common";
import StyledButton from "../common/styledButton";
import z from "zod";
import { apiClient } from "~/api/axios";
import { toast } from "react-toastify";

const ArtifactForm = ({ artifact }: { artifact?: DetailedArtifact }) => {
  const [imageFiles, setImageFiles] = useState<File[] | null>();
  const [deliverableFile, setDeliverableFile] = useState<File | null>();
  const [categories, setCategories] = useState<string>();
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const [slugValidityResult, setSlugValidtyResult] = useState("");
  const fetcher = useFetcher<any>();
  const isSubmitting =
    fetcher.state === "submitting" || fetcher.state === "loading";
  const navigate = useNavigate();

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    storeFiles: (val: any) => void,
    mode: "images" | "deliverable_file",
  ) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length > 0) {
      if (mode === "images") {
        storeFiles((prev: any) => {
          const updatedFiles = [...(prev || []), ...selectedFiles];
          if (imageInputRef.current) {
            const dataTransfer = new DataTransfer();
            updatedFiles.forEach((file) => dataTransfer.items.add(file));
            imageInputRef.current.files = dataTransfer.files;
          }

          return updatedFiles;
        });
        const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));
        setImagePreviewUrls((prev) => [...(prev || []), ...newUrls]);
      } else {
        storeFiles(selectedFiles[0]);
      }
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: DragEvent<HTMLImageElement>) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    setImageFiles((prev) => {
      const newFiles = [...(prev || [])];
      const [movedFile] = newFiles.splice(draggedIndex, 1);
      newFiles.splice(index, 0, movedFile);
      if (imageInputRef.current) {
        const dataTransfer = new DataTransfer();
        newFiles.forEach((file) => dataTransfer.items.add(file));
        imageInputRef.current.files = dataTransfer.files;
      }
      return newFiles;
    });

    setImagePreviewUrls((prev) => {
      const newUrls = [...(prev || [])];
      const [movedUrl] = newUrls.splice(draggedIndex, 1);
      newUrls.splice(index, 0, movedUrl);
      return newUrls;
    });

    setDraggedIndex(null);
  };

  const handleImageDelete = (index: number) => {
    setImageFiles((prev) => {
      const newFiles = [...(prev || [])];
      const updatedFiles = newFiles.filter((_, i) => i !== index);
      if (imageInputRef.current) {
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach((file) => dataTransfer.items.add(file));
        imageInputRef.current.files = dataTransfer.files;
      }
      return updatedFiles;
    });

    setImagePreviewUrls((prev) => {
      const newUrls = [...(prev || [])];
      const updatedUrls = newUrls.filter((_, i) => i !== index);
      return updatedUrls;
    });
  };

  useEffect(() => {
    if (artifact || slug.length === 0) {
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      checkSlugAvailability({
        slug,
        setSlugValidtyResult,
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [slug, checkSlugAvailability, setSlugValidtyResult]);

  useEffect(() => {
    if (!fetcher.data) return;

    if (fetcher.data.success) {
      if (fetcher.data.intent === "create_artifact") {
        toast.success("Artifact Created Successfully!");
      } else if (fetcher.data.intent === "update_artifact") {
        toast.success("Artifact Updated Successfully!");
      }
      navigate(-1);
    } else if (fetcher.data.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  const handleSmartSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const customFormData = new FormData(form);

    if (deliverableFile) {
      customFormData.set("deliverableFiles", deliverableFile);
    }
    if (imageFiles && imageFiles.length > 0) {
      customFormData.delete("imageFiles");
      imageFiles.forEach((file) => {
        customFormData.append("imageFiles", file);
      });
    }

    if (artifact) {
      const updatedDescription = customFormData.get("description") as string;

      const normalizeText = (text: string) =>
        text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

      const normalizedUpdated = normalizeText(updatedDescription);
      const normalizedOriginal = normalizeText(artifact.description || "");

      if (!normalizedUpdated.includes(normalizedOriginal)) {
        return toast.error(
          "The updated description must contain the original description.",
        );
      }
      customFormData.append("id", artifact.id);
    } else {
      const rawCategories = customFormData.get("category") as string;
      customFormData.delete("category");

      if (rawCategories) {
        const categoryArray = rawCategories
          .split(",")
          .map((cat) => cat.trim())
          .filter(Boolean);

        categoryArray.forEach((cat) => {
          customFormData.append("category", cat);
        });
      }

      if (categories?.includes("free") || categories?.includes("no-delivery")) {
        customFormData.delete("amount");
        customFormData.append("amount", "0");
      }
    }

    const remainingKeys = Array.from(customFormData.keys());

    if (remainingKeys.length === 1 && remainingKeys[0] === "intent") {
      return toast.error("No changes detected.");
    }

    fetcher.submit(customFormData, {
      method: artifact ? "PATCH" : "POST",
      action: "/profile",
      encType: "multipart/form-data",
    });
  };

  useEffect(() => {
    if (artifact) {
      setSlug(artifact.slug);
      setImagePreviewUrls(artifact.images);
    }
  }, [artifact]);

  const uploadDeliverableFiles = () => {
    if (!artifact) {
      if (
        !categories?.includes("physical") &&
        !categories?.includes("no-delivery")
      ) {
        return (
          <input
            name={artifact ? undefined : "deliverableFiles"}
            type="file"
            accept=".zip, application/zip"
            className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px] cursor-pointer"
            onChange={(e) =>
              handleFileChange(e, setDeliverableFile, "deliverable_file")
            }
            required={
              !Boolean(artifact) ||
              (!categories?.includes("physical") &&
                !categories?.includes("no-delivery"))
            }
            readOnly={Boolean(artifact)}
          />
        );
      }
    }
  };

  return (
    <form
      className="my-[1.5rem] flex flex-col gap-2"
      onSubmit={handleSmartSubmit}
    >
      <input
        type="hidden"
        name="intent"
        value={artifact ? "update_artifact" : "create_artifact"}
      />
      <label className="w-full font-medium">
        {artifact?.images?.length === 0 ? "Add Photos (minimum 2)" : "Photos"}
      </label>
      <div className="grid grid-flow-col auto-cols-fr gap-[1px]">
        {imagePreviewUrls.map((url, index) => (
          <div
            className={`group relative w-full cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity ${
              draggedIndex === index ? "opacity-50" : ""
            }`}
          >
            <img
              key={url}
              src={url}
              alt={`Upload preview ${index + 1}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className="w-full aspect-square object-cover"
            />
            {!artifact && (
              <div
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
                onClick={() => handleImageDelete(index)}
              >
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M10 11V17"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <path
                      d="M14 11V17"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <path
                      d="M4 7H20"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <path
                      d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <path
                      d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      {artifact?.images?.length !== 0 && (
        <input
          ref={imageInputRef}
          name={artifact ? undefined : "imageFiles"}
          type="file"
          accept="image/*"
          multiple
          className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px] cursor-pointer"
          onChange={(e) => handleFileChange(e, setImageFiles, "images")}
          required={!Boolean(artifact)}
        />
      )}
      {!categories?.includes("physical") &&
        !categories?.includes("no-delivery") && (
          <label className="w-full font-medium">
            {artifact?.deliverable_files
              ? `Deliverable File (.zip)`
              : `Add Deliverable File (.zip)`}
          </label>
        )}
      {artifact?.deliverable_files && (
        <a
          href={artifact?.deliverable_files}
          target="_blank"
          className="text-blue-500 underline w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px] cursor-pointer"
        >
          Deliverable File
        </a>
      )}
      {uploadDeliverableFiles()}
      <label className="w-full font-medium">Title</label>
      <input
        className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
        id="title"
        name={artifact ? undefined : "title"}
        placeholder="Enter your Title"
        defaultValue={artifact?.title}
        required={!Boolean(artifact?.title)}
        readOnly={Boolean(artifact?.title)}
      />
      <label className="w-full font-medium">Description</label>
      <textarea
        className="w-full max-h-[200px] px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
        id="description"
        name="description"
        placeholder="Enter your Description"
        maxLength={800}
        defaultValue={artifact?.description}
        required={true}
      />
      <label className="w-full font-medium">Slug</label>
      <input
        className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
        id="slug"
        name={artifact ? undefined : "slug"}
        placeholder="Enter your Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value.replace(/\s/g, ""))}
        pattern="^\S+$"
        required={!Boolean(artifact?.slug)}
        readOnly={Boolean(artifact?.slug)}
      />
      {slugValidityResult && (
        <p
          style={{
            color: slugValidityResult.includes("not")
              ? "red"
              : slugValidityResult === "slug is available"
                ? "green"
                : "grey",
          }}
        >
          {slugValidityResult}
        </p>
      )}
      <div className="w-full flex flex-col gap-1.5 mb-4">
        <label htmlFor="category" className="w-full font-medium">
          Categories{" "}
          <span className="font-normal text-gray-500 text-sm">
            (comma-separated)
          </span>
        </label>

        <div className="contents">
          <p>Include these special tags to change how the product behaves:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-mono text-xs">
                free
              </code>{" "}
              : Product costs zero.
            </li>
            <li>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-mono text-xs">
                physical
              </code>{" "}
              : Requires physical shipping (no digital download).
            </li>
            <li>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-mono text-xs">
                no-delivery
              </code>{" "}
              : Display only (disables purchasing).
            </li>
          </ul>
        </div>

        <input
          className="w-full px-4 py-2 mt-1 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
          id="category"
          name={artifact ? undefined : "category"}
          placeholder="e.g. painting, abstract, physical, free"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          defaultValue={artifact?.category?.join(", ") || ""}
          required={!Boolean(artifact?.category)}
          readOnly={Boolean(artifact?.category)}
        />
      </div>
      {!categories?.includes("free") &&
        !categories?.includes("no-delivery") && (
          <div className="contents">
            <label className="w-full font-medium">Amount (INR)</label>
            <input
              className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
              id="amount"
              name={artifact ? undefined : "amount"}
              placeholder="Enter your Amount"
              defaultValue={artifact?.amount}
              required={
                !Boolean(artifact?.amount) ||
                (!categories?.includes("free") &&
                  !categories?.includes("no-delivery"))
              }
              readOnly={Boolean(artifact?.amount)}
            />
          </div>
        )}
      <label className="w-full font-medium">Visibiliy</label>
      <div className="flex items-center gap-6 px-1">
        {/* Draft Radio Button */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="isPublished"
            value="false"
            className="w-4 h-4 cursor-pointer accent-[var(--clr-primary)]"
            defaultChecked={
              typeof artifact?.is_published === "boolean"
                ? !artifact.is_published
                : true
            }
          />
          <span>Draft</span>
        </label>

        {/* Publish Radio Button */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="isPublished"
            value="true"
            className="w-4 h-4 cursor-pointer accent-[var(--clr-primary)]"
            defaultChecked={
              typeof artifact?.is_published === "boolean"
                ? artifact.is_published
                : false
            }
          />
          <span>Publish</span>
        </label>
      </div>
      <div className="mt-1" />
      <p className="text-[0.87rem]">
        Double-check your details. Once submitted, artifacts cannot be edited
        (though you can append new text to the description). Deletion is only
        permitted if the artifact has zero purchases.
      </p>
      <StyledButton
        title={(artifact ? "Update" : "Create") + " Artifact"}
        action={() => {}}
        heirarchy="primary"
        length="full-width"
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      />
    </form>
  );
};

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^\S+$/, "slug cannot contain spaces")
  .optional();

const checkSlugAvailability = async ({
  slug,
  setSlugValidtyResult,
}: {
  slug: string;
  setSlugValidtyResult: (val: string) => void;
}) => {
  const result = slugSchema.safeParse(slug);
  if (!result.success) {
    console.error("Invalid slug format");
    return;
  }
  try {
    const response = await apiClient.post("/availability/slug", {
      slug,
    });
    if (response.status === 200 && response.data.success) {
      setSlugValidtyResult("slug is available");
    } else {
      setSlugValidtyResult("slug not available");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      setSlugValidtyResult("slug not available");
    } else {
      console.error(error);
      setSlugValidtyResult("error checking availability");
    }
  }
};

export default ArtifactForm;

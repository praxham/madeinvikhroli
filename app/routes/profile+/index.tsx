import { useEffect, useState, type ChangeEvent } from "react";
import { Form, useFetcher, useNavigation, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import z from "zod";
import { apiClient } from "~/api/axios";
import AddUPI from "~/components/common/addUPI";
import { getArtist } from "~/components/common/navbar";
import StyledButton from "~/components/common/styledButton";
import { useArtistStore, useUserStore } from "~/store";
import type { Artist, User } from "~/types/common";

const Index = () => {
  const user = useUserStore((state) => state.user) as User;
  const artist = useArtistStore((state) => state.artist) as Artist;
  const role = useUserStore((state) => state.user?.role);
  const wantToBecomeSeller = useUserStore(
    (state) => state.user?.wantToBecomeSeller,
  );
  const addArtist = useArtistStore((state) => state.addArtist);
  const [searchParams, setSearchParams] = useSearchParams();
  const [file, setFile] = useState<File | null>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigation = useNavigation();
  const fetcher = useFetcher<any>();
  const isSubmitting =
    fetcher.state === "submitting" || fetcher.state === "loading";
  const [username, setUsername] = useState(artist?.username);
  const [usernameValidityResult, setUsernameValidtyResult] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const imageToRender = previewUrl || artist?.profile_photo;

  useEffect(() => {
    if (!fetcher.data) return;

    const updateArtist = async () => {
      const result = await getArtist(artist?.id);
      if (result.id) {
        addArtist({
          ...user,
          username: result.username,
          profile_photo: result.profile_photo,
          socials: result.socials,
          description: result.description,
          wa_number: result.wa_number,
        });
      }
    };

    if (fetcher.data.success && fetcher.data.intent === "update_profile") {
      toast.success("Profile updated successfully!");
      updateArtist();
    } else if (fetcher.data.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  const handleSmartSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const customFormData = new FormData(form);

    const instaValue = (customFormData.get("social_instagram") || "") as string;
    const xValue = (customFormData.get("social_x") || "") as string;

    customFormData.delete("social_instagram");
    customFormData.delete("social_x");

    const originalInsta = artist?.socials?.[0]?.instagram || "";
    const originalX = artist?.socials?.[1]?.x || "";

    if (instaValue !== originalInsta || xValue !== originalX) {
      const combinedSocials = [{ instagram: instaValue }, { x: xValue }];
      customFormData.append("socials", JSON.stringify(combinedSocials));
    }

    for (const [key, value] of Array.from(customFormData.entries())) {
      if (key === "intent") continue;

      if (value instanceof File && value.size === 0) {
        customFormData.delete(key);
        continue;
      }

      if (key === "profile_photo") {
        customFormData.delete(key);
        if (file) customFormData.append("profilePhotoFile", file);
        continue;
      }

      if (
        typeof value === "string" &&
        artist?.[key as keyof typeof artist] !== undefined
      ) {
        const originalValue = String(artist[key as keyof typeof artist] || "");

        if (value === originalValue) {
          customFormData.delete(key);
        }
      }
    }

    const remainingKeys = Array.from(customFormData.keys());

    if (remainingKeys.length === 1 && remainingKeys[0] === "intent") {
      toast.error("No changes detected.");
      return;
    }

    fetcher.submit(customFormData, {
      method: "POST",
      action: "/profile",
      encType: "multipart/form-data",
    });
  };

  useEffect(() => {
    if (username === artist?.username) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      checkUsernameAvailability({
        username,
        setUsernameValidtyResult,
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [
    username,
    artist?.username,
    checkUsernameAvailability,
    setUsernameValidtyResult,
  ]);

  return (
    <div className="flex flex-col gap-4 my-4">
      {role === "seller" || wantToBecomeSeller ? (
        <Form
          action="/profile"
          method="POST"
          encType="multipart/form-data"
          className="flex flex-col items-start gap-2"
          onSubmit={handleSmartSubmit}
        >
          <input type="hidden" name="intent" value="update_profile" />
          <label className="w-full font-medium">Profile Photo</label>
          {imageToRender && (
            <img
              className="w-[200px] aspect-square object-cover rounded-full"
              src={imageToRender}
              alt=""
            />
          )}
          <input
            name="profile_photo"
            type="file"
            accept="image/*"
            className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px] cursor-pointer"
            onChange={handleFileChange}
          />
          <label className="w-full font-medium">Email ID</label>
          <input
            className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px] text-[var(--clr-grey-three)]"
            id="emailId"
            placeholder="Enter your Email ID"
            defaultValue={user?.emailId}
            readOnly
          />
          <label className="w-full font-medium">UPI ID</label>
          <input
            className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
            id="upiId"
            name="upiId"
            placeholder="Enter your UPI ID"
            defaultValue={user?.upiId}
            required={!Boolean(user?.upiId)}
            readOnly={Boolean(user?.upiId)}
          />
          <label className="w-full font-medium">Username</label>
          <input
            className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
            id="username"
            name="username"
            placeholder="Enter your Username"
            defaultValue={artist?.username}
            required={!Boolean(artist?.username)}
            // readOnly={Boolean(artist?.username)}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameValidityResult && (
            <p
              style={{
                color: usernameValidityResult.includes("not") ? "red" : "green",
              }}
            >
              {usernameValidityResult}
            </p>
          )}
          <label className="w-full font-medium">Description</label>
          <textarea
            className="w-full max-h-[200px] px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
            id="description"
            name="description"
            placeholder="Enter your Description"
            maxLength={400}
            defaultValue={artist?.description}
            required={!Boolean(artist?.description)}
          />
          <label className="w-full font-medium">
            Whatsapp Number (optional)
          </label>
          <input
            className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
            id="wa_number"
            name="wa_number"
            placeholder="Enter your Whatsapp Number"
            defaultValue={artist?.wa_number}
            readOnly={Boolean(artist?.wa_number)}
          />
          <label className="w-full font-medium">Socials</label>
          <div className="w-full grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
            <label className="w-full font-medium" htmlFor="social_instagram">
              Instagram
            </label>
            <input
              className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
              id="social_instagram"
              name="social_instagram"
              placeholder="Enter your Instagram Username"
              defaultValue={artist?.socials[0].instagram}
              required={!Boolean(artist?.socials[0].instagram)}
              readOnly={Boolean(artist?.socials[0].instagram)}
            />

            <label className="w-full font-medium" htmlFor="social_x">
              X
            </label>
            <input
              className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
              id="social_x"
              name="social_x"
              placeholder="Enter your X Username"
              defaultValue={artist?.socials[1].x}
              required={!Boolean(artist?.socials[1].x)}
              readOnly={Boolean(artist?.socials[1].x)}
            />
          </div>

          <div className="mt-1" />
          <StyledButton
            title={"Update Details"}
            action={() => {}}
            heirarchy="primary"
            length="full-width"
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting || usernameValidityResult.includes("not")}
          />
        </Form>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="w-full font-medium">Email:</h2>
            <p className="text-[0.87rem]" id="email">
              {user?.emailId}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="w-full font-medium">UPI ID:</h2>
            <p className="text-[0.87rem]" id="email">
              {user?.upiId ? user?.upiId : "Not Available"}
            </p>
          </div>
          <div className="flex flex-row gap-2 mt-2">
            {!user?.upiId && (
              <StyledButton
                title="Add UPI ID"
                heirarchy="primary"
                length="full-width"
                action={() => setSearchParams({ add_upi: "true" })}
              />
            )}
            {!user?.hasOrders && (
              <StyledButton
                title="Delete Account"
                heirarchy="primary"
                length="full-width"
                action={() => {}}
                style={{ backgroundColor: "var(--clr-danger)", color: "white" }}
              />
            )}
          </div>
        </div>
      )}

      {searchParams.get("add_upi") === "true" && (
        <AddUPI user={user} handleClose={() => setSearchParams({})} />
      )}
    </div>
  );
};

const usernameSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^\S+$/, "Username cannot contain spaces")
  .optional();

const checkUsernameAvailability = async ({
  username,
  setUsernameValidtyResult,
}: {
  username: string;
  setUsernameValidtyResult: (val: string) => void;
}) => {
  const result = usernameSchema.safeParse(username);
  if (!result.success) {
    console.error("Invalid username format");
    return;
  }
  try {
    const response = await apiClient.post("/availability/username", {
      username,
    });
    if (response.status === 200 && response.data.success) {
      setUsernameValidtyResult("username is available");
    } else {
      setUsernameValidtyResult("username not available");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      setUsernameValidtyResult("username not available");
    } else {
      // Handle actual network errors or 500 server errors
      console.error(error);
      setUsernameValidtyResult("error checking availability");
    }
  }
};

export default Index;

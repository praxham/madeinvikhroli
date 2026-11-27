import { NavLink, useSearchParams } from "react-router";
import { useArtistStore, useUserStore } from "~/store";
import { deleteCookieData } from "~/functions";
import { useState } from "react";

const Footer = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const role = useUserStore((state) => state.user?.role);
  const removeUser = useUserStore((state) => state.removeUser);
  const removeArtistStore = useArtistStore((state) => state.removeArtist);
  const [showLogOutConfirmation, setShowLogOutConfirmation] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isSignInOpen = searchParams.get("sign_in") === "true";
  const removeArtist = role === "seller" ? removeArtistStore : null;

  const handleClose = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-[#E6E6E6] text-black px-4 py-1 bottom-0 right-0 text-[12px]">
      <div className="max-w-(--website-horizontal-size) mx-auto flex flex-row gap-4">
        <NavLink to="/terms-n-conditions">Terms & Conditions</NavLink>
        <a href="https://github.com/praxham/madeinvikhroli/issues">
          Report Bug
        </a>
      </div>
    </div>
  );
};

export const logOut = async ({
  removeUser,
  removeArtist,
}: {
  removeUser: () => void;
  removeArtist: (() => void) | null;
}) => {
  removeUser();
  if (removeArtist) removeArtist();
  deleteCookieData("authToken");
};

export default Footer;

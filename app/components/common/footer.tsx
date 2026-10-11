import { Link, NavLink, useSearchParams } from "react-router";
import VikhrolitNirmitText from "../../assets/footer/vikhrolit-nirmit-text.svg?react";
import SignIn from "./signIn";
import { useArtistStore, useUserStore } from "~/store";
import { deleteCookieData } from "~/functions";
import { useState } from "react";
import DialogueBox from "./dialogueBox";

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
    <div className="bg-black text-white px-4 py-16 lg:px-0">
      <div className="max-w-[var(--website-horizontal-size)] mx-auto">
        <div className="grid grid-cols-2 w-full gap-4 text-[1.2rem] md:text-[1.5rem] font-semibold items-start">
          <div className="grid grid-cols-1 gap-[19px]">
            <NavLink
              to="/artifacts"
              className={({ isActive }) =>
                isActive
                  ? "text-[var(--clr-primary)]"
                  : "text-[var(--clr-grey-three)]"
              }
            >
              Artifacts
            </NavLink>
            <NavLink
              to="/members"
              className={({ isActive }) =>
                isActive
                  ? "text-[var(--clr-primary)]"
                  : "text-[var(--clr-grey-three)]"
              }
            >
              Members
            </NavLink>
            {!isLoggedIn && (
              <button
                className={`w-fit cursor-pointer ${isSignInOpen ? "text-[var(--clr-primary)]" : "text-[var(--clr-grey-three)]"}`}
                onClick={() => setSearchParams({ sign_in: "true" })}
              >
                Sign In
              </button>
            )}
            {isLoggedIn && (
              <button
                className="w-fit cursor-pointer text-[var(--clr-grey-three)]"
                onClick={() => setShowLogOutConfirmation(true)}
              >
                Log Out
              </button>
            )}
          </div>
          {isSignInOpen && <SignIn handleClose={handleClose} />}
          {showLogOutConfirmation && (
            <DialogueBox
              title="Log Out"
              subtitle="are you sure want to log out?"
              handleClose={() => setShowLogOutConfirmation(false)}
              confirmFunction={() => {
                setShowLogOutConfirmation(false);
                logOut({ removeUser, removeArtist });
                window.location.replace("/");
              }}
            />
          )}
          <div className="grid grid-cols-1 gap-[19px]">
            <NavLink
              to="/terms-n-conditions"
              className={({ isActive }) =>
                isActive
                  ? "text-[var(--clr-primary)]"
                  : "text-[var(--clr-grey-three)]"
              }
            >
              Terms & Conditions
            </NavLink>
            <a
              href="https://github.com/praxham/madeinvikhroli/issues"
              className="text-[var(--clr-grey-three)]"
            >
              Report Bug
            </a>
          </div>
        </div>
        <VikhrolitNirmitText className="w-full h-auto mt-[64px]" />
      </div>
    </div>
  );
};

const logOut = async ({
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

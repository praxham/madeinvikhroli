import { Link, NavLink } from "react-router";
import UserProfileIcon from "../../assets/navbar/user-profile.svg?react";
import { useArtistStore, useUserStore } from "~/store";
import { useEffect } from "react";
import { getCookieData } from "~/functions";
import { apiClient } from "~/api/axios";

const Navbar = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const user = useUserStore((state) => state.user);
  const profilePhoto = useArtistStore((state) => state.artist?.profile_photo);
  const addUser = useUserStore((state) => state.addUser);
  const addArtist = useArtistStore((state) => state.addArtist);

  const id = user?.id;
  const role = user?.role;

  useEffect(() => {
    const checkSession = async () => {
      if (!isLoggedIn) {
        const token = getCookieData("authToken");
        if (token) {
          const user = await authMe();

          if (user?.id) {
            addUser({
              id: user.id,
              emailId: user.email_id,
              role: user.role,
              upiId: user.upi_id ? user.upi_id : null,
              hasOrders: user.hasOrders,
              wantToBecomeSeller:
                user.seller_status === "pending" ? true : false,
            });
          }
        }
      }
    };

    checkSession();
  }, [isLoggedIn, addUser]);

  useEffect(() => {
    const checkAndGetArtistDetails = async () => {
      if (
        role === "seller" &&
        typeof id === "string" &&
        id.length > 0 &&
        user
      ) {
        const artist = await getArtist(id);

        if (artist?.id) {
          addArtist({
            ...user,
            username: artist.username,
            profile_photo: artist.profile_photo,
            socials: artist.socials,
            description: artist.description,
            wa_number: artist.wa_number,
          });
        }
      }
    };

    checkAndGetArtistDetails();
  }, [role]);

  return (
    <div className="flex flex-row gap-4 justify-between items-center px-4 lg:px-0">
      <Link to="/">
        <img src="/assets/common/miv-logo-horizontal.webp" alt="MIV Logo" />
      </Link>

      <div className="bg-[var(--clr-background-one)] hidden md:flex flex-row items-center gap-6 py-2 px-4 rounded-[var(--corner-radius)] font-medium">
        <NavLink
          to="/artifacts"
          className={({ isActive }) =>
            isActive
              ? "text-[var(--clr-primary)]"
              : "text-[var(--clr-grey-one)]"
          }
        >
          Artifacts
        </NavLink>
        <NavLink
          to="/members"
          className={({ isActive }) =>
            isActive
              ? "text-[var(--clr-primary)]"
              : "text-[var(--clr-grey-one)]"
          }
        >
          Members
        </NavLink>
        {isLoggedIn && (
          <NavLink to="/profile" className="cursor-pointer">
            {role === "seller" ? (
              <img
                className="w-[32px] aspect-square rounded-full"
                src={profilePhoto}
              />
            ) : (
              <UserProfileIcon />
            )}
          </NavLink>
        )}
      </div>
      <input type="checkbox" id="sidebar-toggle" className="peer hidden" />
      <div className="flex flex-row items-center gap-2 md:hidden">
        {isLoggedIn && (
          <NavLink to="/profile" className="cursor-pointer">
            {role === "seller" ? (
              <img
                className="w-[32px] aspect-square rounded-full"
                src={profilePhoto}
              />
            ) : (
              <UserProfileIcon />
            )}
          </NavLink>
        )}
        <label htmlFor="sidebar-toggle" className="cursor-pointer">
          <svg
            width="24px"
            height="24px"
            viewBox="-0.5 0 25 25"
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
                d="M2 12.32H22"
                stroke="#000000"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M2 18.32H22"
                stroke="#000000"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M2 6.32001H22"
                stroke="#000000"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </label>
      </div>

      <div className="flex md:hidden flex-col h-screen bg-black w-64 fixed top-0 right-0 pt-16 px-6 gap-8 font-medium z-50 shadow-2xl transform translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out">
        <label
          htmlFor="sidebar-toggle"
          className="absolute top-5 right-5 cursor-pointer"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </label>
        <label htmlFor="sidebar-toggle" className="cursor-pointer block">
          <NavLink
            to="/artifacts"
            className={({ isActive }) =>
              isActive
                ? "text-[var(--clr-primary)]"
                : "text-gray-300 hover:text-white transition-colors"
            }
          >
            Artifacts
          </NavLink>
        </label>
        <label htmlFor="sidebar-toggle" className="cursor-pointer block">
          <NavLink
            to="/members"
            className={({ isActive }) =>
              isActive
                ? "text-[var(--clr-primary)]"
                : "text-gray-300 hover:text-white transition-colors"
            }
          >
            Members
          </NavLink>
        </label>
        <label htmlFor="sidebar-toggle" className="cursor-pointer block">
          {isLoggedIn && (
            <NavLink to="/profile" className="cursor-pointer">
              {role === "seller" ? (
                <img
                  className="w-[48px] aspect-square rounded-full object-cover border-2 border-gray-700"
                  src={profilePhoto}
                  alt="Profile"
                />
              ) : (
                <div className="text-white">
                  <UserProfileIcon />
                </div>
              )}
            </NavLink>
          )}
        </label>
      </div>
    </div>
  );
};

const authMe = async () => {
  try {
    const response = await apiClient.get(`/auth/me`);
    return response.data?.data;
  } catch (error) {
    console.error(error);
  }
};

export const getArtist = async (id: string) => {
  try {
    const response = await apiClient.get(`/artist/?id=${id}&toShowOn=all`);
    const rawArtist = response.data?.data[0];
    const parsedData = { ...rawArtist, socials: JSON.parse(rawArtist.socials) };
    return parsedData;
  } catch (error) {
    console.error(error);
  }
};

export default Navbar;

import {
  NavLink,
  Outlet,
  redirect,
  useLocation,
  type ActionFunctionArgs,
} from "react-router";
import { apiClient } from "~/api/axios";
import { getServerCookieData } from "~/functions";
import { useUserStore } from "~/store";

export const loader = async ({ request }: { request: Request }) => {
  const token = getServerCookieData(request, "authToken");
  const isLoggedIn = Boolean(token);

  if (!isLoggedIn) {
    throw redirect("/");
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const token = getServerCookieData(request, "authToken");

  try {
    switch (intent) {
      case "update_profile": {
        const response = await apiClient.patch("/artist/", formData, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "multipart/form-data",
          },
        });

        return { success: true, intent, data: response.data };
      }
      case "create_artifact": {
        const response = await apiClient.post("/artifact/", formData, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "multipart/form-data",
          },
        });

        return { success: true, intent, data: response.data };
      }
      case "update_artifact": {
        const response = await apiClient.patch("/artifact/", formData, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "multipart/form-data",
          },
        });

        return { success: true, intent, data: response.data };
      }
      case "delete_artifact": {
        const response = await apiClient.delete("/artifact/", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          data: { id: formData.get("id") },
        });

        return { success: true, intent, data: response.data };
      }
      default:
        return { error: "Unknown action intent", status: 400 };
    }
  } catch (error: any) {
    console.error("Action caught an error:", error?.response?.data || error);
    if (error.isAxiosError && error.response) {
      return {
        error: error.response.data?.message || "API request failed",
        status: error.response.status,
      };
    }
    return { error: error.message || "Internal Server Error", status: 500 };
  }
};

const Layout = () => {
  const role = useUserStore((state) => state.user?.role);
  const location = useLocation();

  const routesToRender =
    role === "seller"
      ? profileRoutes.concat(sellerProfileRoutes)
      : profileRoutes;

  const activeRoute = [...routesToRender]
    .sort((a, b) => b.route.length - a.route.length)
    .find((route) => {
      // Format the expected path and remove trailing slashes for clean matching
      const expectedPath = route.route.startsWith("/")
        ? route.route
        : `/profile/${route.route}`.replace(/\/$/, "");

      return (
        location.pathname === expectedPath ||
        location.pathname.startsWith(`${expectedPath}/`)
      );
    });

  const pageTitle = activeRoute ? activeRoute.name : "Account Details";

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  // 2. Determine if the last segment is a sub-page (like "create") rather than a main route
  const isSubPage =
    lastSegment !== "profile" &&
    !routesToRender.some(
      (route) => route.route.replace(/^\//, "") === lastSegment,
    );

  // 3. Capitalize the sub-page string for display (e.g., "create" -> "Create")
  const subPageTitle = lastSegment
    ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    : "";

  return (
    <div className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-x-4 gap-y-6 my-9">
      <div className="flex flex-col gap-y-[1.2rem] bg-white p-4 rounded-[var(--corner-radius)] font-medium">
        {routesToRender.map((route, i) => (
          <NavLink
            key={i}
            end
            to={route.route}
            className={({ isActive }) =>
              isActive
                ? "text-[var(--clr-primary)]"
                : "text-[var(--clr-grey-one)]"
            }
          >
            {route.name}
          </NavLink>
        ))}
        <button className="text-start mt-auto">Log Out</button>
      </div>
      <div className="bg-white p-4 rounded-[var(--corner-radius)] ">
        <div className="flex flex-row gap-2">
          <h1 className="heading1">{pageTitle}</h1>
          {isSubPage && (
            <>
              <p className="heading1">{`>`}</p>
              <h2 className="heading1 text-[var(--clr-grey-two)]">
                {subPageTitle}
              </h2>
            </>
          )}
        </div>

        <Outlet />
      </div>
    </div>
  );
};

const profileRoutes = [
  { name: "Account Details", route: "/profile" },
  { name: "Orders", route: "placed-orders" },
];

const sellerProfileRoutes = [
  { name: "Recived Orders", route: "received-orders" },
  { name: "Artifacts", route: "artifacts" },
];

export default Layout;

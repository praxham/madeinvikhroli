import { useLoaderData } from "react-router";
import { apiClient } from "~/api/axios";
import CommonErrorBoundary from "~/components/common/commonErrorBoundary";
import NoContent from "~/components/common/noContent";
import OrdersTable from "~/components/orders/ordersTable";
import { getServerCookieData } from "~/functions";

export const loader = async ({ request }: { request: Request }) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;
  const token = getServerCookieData(request, "authToken");

  const orders = await getOrders({ token, page, limit });

  return { orders: orders || [], page, limit };
};

const PlacedOrders = () => {
  const { orders, page, limit } = useLoaderData();

  if (orders.length === 0) {
    return <NoContent title="Orders" />;
  }
  return (
    <div className="flex flex-col gap-4 my-4">
      <OrdersTable orders={orders} page={page} limit={limit} />
    </div>
  );
};

export const ErrorBoundary = CommonErrorBoundary;

const getOrders = async ({
  token,
  page = 1,
  limit = 12,
}: {
  token: string | null;
  page: number;
  limit: number;
}) => {
  try {
    const response = await apiClient.get(
      `/order/?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      },
    );

    return response?.data?.data;
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to fetch orders";
    if (errorMessage === "No orders found for current user.") {
      return [];
    }
    throw new Error(errorMessage);
  }
};

export default PlacedOrders;

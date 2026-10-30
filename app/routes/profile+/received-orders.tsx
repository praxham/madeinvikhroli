import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import z from "zod";
import { apiClient } from "~/api/axios";
import CommonErrorBoundary from "~/components/common/commonErrorBoundary";
import DialogueBox from "~/components/common/dialogueBox";
import NoContent from "~/components/common/noContent";
import OrdersTable from "~/components/orders/ordersTable";
import { getServerCookieData } from "~/functions";

export const loader = async ({ request }: { request: Request }) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;
  const token = getServerCookieData(request, "authToken");

  const orders = await getOrders({ token, id: null, page, limit });

  return { orders: orders || [], page, limit };
};

const ReceivedOrders = () => {
  const { orders, page, limit } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (orders.length === 0) {
    return <NoContent title="Orders" />;
  }

  const UTRFromSearchparams = searchParams.get("utr");

  const selectedOrder = orders.find(
    (order: { utr: string }) => order.utr === UTRFromSearchparams,
  );

  const orderId = selectedOrder?.id;

  const handleSubmit = (paymentStatus: "confirmed" | "rejected") => {
    if (!orderId) return;
    updateOrderStatus({
      id: orderId,
      payment_status: paymentStatus,
      handleClose: () => {
        setSearchParams({});
      },
      setIsSubmitting,
    });
  };

  return (
    <div className="flex flex-col gap-4 my-4">
      <OrdersTable orders={orders} page={page} limit={limit} />
      {orderId && selectedOrder && (
        <DialogueBox
          title="Update Payment Status"
          subtitle={`Please open your UPI app and verify if you have received the payment from ${selectedOrder.buyer_upi_id} for ${selectedOrder.artifact_slug.toUpperCase()}.\n\nAmount: ₹${selectedOrder.amount}\nUTR: ${selectedOrder.utr}`}
          handleClose={() => {
            setSearchParams((prev) => {
              prev.delete("id");
              return prev;
            });
          }}
          rejectFunction={() => handleSubmit("rejected")}
          confirmFunction={() => handleSubmit("confirmed")}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export const ErrorBoundary = CommonErrorBoundary;

const getOrders = async ({
  token,
  id,
  page = 1,
  limit = 12,
}: {
  token: string | null;
  id: string | null;
  page: number;
  limit: number;
}) => {
  try {
    const response = await apiClient.get(
      `/order/?get_artist_orders=${true}${id ? `&order_id=${id}` : ""}&page=${page}&limit=${limit}`,
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

const paymentStatusSchema = z.enum(["confirmed", "rejected"]);

const updateOrderStatus = async ({
  id,
  payment_status,
  handleClose,
  setIsSubmitting,
}: {
  id: string;
  payment_status: "confirmed" | "rejected";
  handleClose: () => void;
  setIsSubmitting: (val: boolean) => void;
}) => {
  const result = paymentStatusSchema.safeParse(payment_status);
  if (!result.success) {
    console.error("Invalid payment_status format");
    return;
  }
  setIsSubmitting(true);
  try {
    const response = await apiClient.patch("/order/", {
      id,
      payment_status,
    });
    if (response.status === 201 && response.data.success) {
      toast.success("Successfully Updated Payment Status!");
    }
    handleClose();
  } catch (err: any) {
    console.error(err);
    toast.error(
      `Something Went Wrong! error: ${err.response?.data?.message || err.message || "Failed to fetch orders"}`,
    );
  } finally {
    setIsSubmitting(false);
  }
};

export default ReceivedOrders;

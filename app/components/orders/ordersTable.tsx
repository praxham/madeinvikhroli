import type { Order } from "~/types/common";
import OrderRow from "./orderRow";
import { useLocation, useSearchParams } from "react-router";
import { useEffect, useState } from "react";

const OrdersTable = ({
  orders,
  page,
  limit,
}: {
  orders: Order[];
  page: number;
  limit: number;
}) => {
  const location = useLocation();
  const renderingForSeller = Boolean(
    location.pathname.includes("received-orders"),
  );
  const [updatePaymentStatusFor, setUpdatePaymentStatusFor] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const getFormattedPaymentStatus = (
    paymentStatus: Order["payment_status"],
  ) => {
    switch (paymentStatus) {
      case "pending_seller_confirmation":
        // Amber/Yellow for pending
        return { text_color: "#92400e", bg_color: "#fef3c7" };
      case "confirmed":
        // Green for confirmed
        return { text_color: "#166534", bg_color: "#dcfce3" };
      case "disputed":
        // Purple for disputed
        return { text_color: "#6b21a8", bg_color: "#f3e8ff" };
      case "rejected":
        // Red for rejected
        return { text_color: "#991b1b", bg_color: "#fee2e2" };
      case "resolved":
        // Blue for resolved
        return { text_color: "#1e40af", bg_color: "#dbeafe" };
      default:
        // Gray fallback
        return { text_color: "#374151", bg_color: "#f3f4f6" };
    }
  };
  const formatToIST = (dateString: string | undefined | null) => {
    if (!dateString) return "-";

    const normalizedString = dateString.includes("T")
      ? dateString
      : dateString.replace(" ", "T") + "Z";

    const date = new Date(normalizedString);

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    if (updatePaymentStatusFor) {
      setSearchParams((prev) => {
        prev.delete("id");
        return prev;
      });
      setSearchParams({ id: updatePaymentStatusFor });
    }
  }, [updatePaymentStatusFor]);

  const formattedData = orders.map((order, index) => ({
    ...order,
    amount: "₹" + order.amount,
    row_colour: index % 2 === 0 ? "#ffffff" : "#f9fafb",
    payment_status:
      order.payment_status === "pending_seller_confirmation"
        ? "pending"
        : order.payment_status?.replaceAll("_", " "),
    payment_status_info: `${order.payment_status} last updated by ${["pending_seller_confirmation", "resolved"].includes(order.payment_status) ? "admin" : "seller"} on ${formatToIST(order.updated_at)}`,
    payment_status_color: getFormattedPaymentStatus(order.payment_status),
    created_at: formatToIST(order.created_at),
  }));

  return (
    <table className="w-full rounded-[var(--corner-radius)]">
      <thead className="bg-gray-50 border-b-2 border-gray-200">
        <tr className="[&>th]:p-3 [&>th]:text-sm [&>th]:font-medium [&>th]:tracking-wide [&>th]:text-left">
          <th className="w-50">Artifact</th>
          <th className="w-20">
            {renderingForSeller ? "Bought By" : "Purchased From"}
          </th>
          <th className="w-20">Amount</th>
          <th className="w-20">UTR</th>
          <th className="w-10">
            {renderingForSeller ? "Action" : "Payment Status"}
          </th>
          {!renderingForSeller && <th className="w-10">Content</th>}
          <th className="w-20">Purchased On</th>
        </tr>
      </thead>
      <tbody className="divde-y ">
        {formattedData.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            renderingForSeller={renderingForSeller}
            showUpdatePaymentStatusPopup={() =>
              setSearchParams((prev) => {
                prev.set("id", order.id);
                return prev;
              })
            }
          />
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;

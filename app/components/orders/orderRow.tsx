import { Link } from "react-router";
import type { Order } from "~/types/common";
import StyledButton from "../common/styledButton";

const OrderRow = ({
  order,
  renderingForSeller,
  showUpdatePaymentStatusPopup,
}: {
  order: Order;
  renderingForSeller: boolean;
  showUpdatePaymentStatusPopup: () => void;
}) => {
  return (
    <tr key={order.id} style={{ backgroundColor: order.row_colour }}>
      <td className="p-3 text-sm text-blue-700 underline">
        <Link
          to={`/artifacts/${order.artifact_slug}`}
          className="flex flex-row items-center justify-start"
        >
          <img
            className="w-[2rem] aspect-square object-cover rounded-full"
            src={order.artifact_image}
            alt=""
          />
          <span className="pl-3">{order.artifact_slug}</span>
        </Link>
      </td>
      <td className="p-3 text-sm ">
        {renderingForSeller ? (
          <span>{order.buyer_upi_id}</span>
        ) : (
          <Link
            className="text-blue-700 underline"
            to={`/members/${order.artist_username}`}
          >
            {order.artist_username}
          </Link>
        )}
      </td>
      <td className="p-3 text-sm text-gray-700">{order.amount}</td>
      <td className="p-3 text-sm text-gray-700">{order.utr}</td>
      <td
        className="p-3 text-sm text-gray-700"
        title={renderingForSeller ? undefined : order.payment_status_info}
      >
        {renderingForSeller && order.payment_status === "pending" ? (
          <StyledButton
            title="Review"
            heirarchy="primary"
            action={showUpdatePaymentStatusPopup}
          />
        ) : (
          <span
            className="p-1.5 px-3 text-xs font-medium uppercase tracking-wider bg-opacity-50 rounded-full select-none"
            style={{
              backgroundColor: order.payment_status_color.bg_color,
              color: order.payment_status_color.text_color,
            }}
          >
            {order.payment_status}
          </span>
        )}
      </td>
      {!renderingForSeller &&
        (order.payment_status === "confirmed" && order.content_url ? (
          <td
            className="p-3 text-sm text-blue-700 underline"
            onClick={() => window.open(order.content_url, "_blank")}
          >
            Download .zip
          </td>
        ) : (
          <td className="p-3 text-sm text-gray-400">Not Available</td>
        ))}
      <td className="p-3 text-sm text-gray-700">{order.created_at}</td>
    </tr>
  );
};

export default OrderRow;

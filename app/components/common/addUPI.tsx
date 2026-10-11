import { useState } from "react";
import StyledButton from "./styledButton";
import z from "zod";
import { apiClient } from "~/api/axios";
import { useUserStore } from "~/store";
import type { User } from "~/types/common";
import { toast } from "react-toastify";

const AddUPI = ({
  user,
  handleClose,
}: {
  user: User;
  handleClose: () => void;
}) => {
  const [upiId, setUpiId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const updateUser = useUserStore((state) => state.updateUser);

  return (
    <div className="fixed w-screen h-screen text-[1rem] font-normal">
      <div
        onClick={handleClose}
        className="fixed top-0 left-0 w-screen h-screen bg-black/50"
      />

      <div className="fixed min-w-[500px] top-[50%] left-[50%] transform-[translate(-50%,-50%)] rounded-[var(--corner-radius)] p-4 bg-white text-black border-[var(--clr-border-grey-one)] border-[1px]">
        <h1 className="heading1">Add UPI ID</h1>
        <h2 className="heading2 text-[var(--clr-grey-one)] mt-1">
          Add UPI ID to purchase products
        </h2>
        <p className="text-[0.87rem]">
          we highly recommend you to not use any phone number based upi id
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitUPIId({ upiId, setIsLoading, updateUser, handleClose });
          }}
          className="flex flex-col items-center gap-2 mt-4"
        >
          <label className="w-full font-medium">UPI ID</label>
          <input
            className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
            id="otp"
            name="otp"
            placeholder="Enter your UPI ID"
            type="text"
            value={upiId}
            pattern={UPI_REGEX.source}
            title="Please enter a valid UPI ID (e.g., username@bank)"
            required
            onChange={(e) => setUpiId(e.target.value)}
          />
          <div className="mt-1" />
          <StyledButton
            title="Add UPI ID"
            action={() => {}}
            heirarchy="primary"
            length="full-width"
            type="submit"
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,50}@[a-zA-Z]{2,}$/;

const upiIdValidator = (message = "Invalid UPI ID") =>
  z.string().trim().regex(UPI_REGEX, { message });

export const upiIdSchema = upiIdValidator();

const submitUPIId = async ({
  upiId,
  setIsLoading,
  updateUser,
  handleClose,
}: {
  upiId: string;
  setIsLoading: (val: boolean) => void;
  updateUser: (val: Partial<User>) => void;
  handleClose: () => void;
}) => {
  const result = upiIdSchema.safeParse(upiId);
  if (!result.success) {
    return toast.error("Invalid UPI ID format");
  }
  setIsLoading(true);
  try {
    const response = await apiClient.patch("/user/", {
      upiId,
    });
    if (response.status !== 200 || !response.data.success) {
      return toast.error(
        `Failed to update user details!, error: ${response.data.message}`,
      );
    }
    updateUser({ upiId });
    toast.success("Successfully Added UPI ID!");
    handleClose();
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

export default AddUPI;

import z from "zod";
import StyledButton from "./styledButton";
import { useState, type FormEvent } from "react";
import { apiClient } from "~/api/axios";
import { useUserStore } from "~/store";
import type { User } from "~/types/common";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { UPI_REGEX, upiIdSchema } from "./addUPI";

const SignIn = ({ handleClose }: { handleClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [upiId, setUpiId] = useState("");
  const [otp, setOTP] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const addUser = useUserStore((state) => state.addUser);
  const isArtifactRoute = window.location.toString().includes("artifacts/");

  return (
    <div className="fixed w-screen h-screen text-[1rem] font-normal">
      <div
        onClick={handleClose}
        className="fixed top-0 left-0 w-screen h-screen bg-black/50"
      />

      <div className="fixed w-[calc(100vw-2rem)] lg:w-[500px] top-[50%] left-[50%] transform-[translate(-50%,-50%)] rounded-[var(--corner-radius)] p-4 bg-white text-black border-[var(--clr-border-grey-one)] border-[1px]">
        <h1 className="heading1">Sign In</h1>
        <h2 className="heading2 text-[var(--clr-grey-one)] mt-1">
          Sign in or create an account
        </h2>
        {isOTPSent ? (
          <form
            onSubmit={(e) =>
              otpSubmit({
                email,
                otp,
                e,
                setLoading,
                handleClose,
                addUser,
                redirect: isArtifactRoute
                  ? "/artifacts/vibrant-queen?purchase=true"
                  : undefined,
              })
            }
            className="flex flex-col items-center gap-2 mt-4"
          >
            <label className="w-full font-medium">OTP</label>
            <input
              className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
              id="otp"
              name="otp"
              placeholder="Enter your OTP"
              type="text"
              value={otp}
              title="Please enter a valid 6 digit OTP"
              required
              onChange={(e) => setOTP(e.target.value)}
            />
            <div className="mt-1" />
            <StyledButton
              title="Verify OTP"
              action={() => {}}
              heirarchy="primary"
              length="full-width"
              type="submit"
              isLoading={isLoading}
            />
          </form>
        ) : (
          <form
            onSubmit={(e) =>
              signInSubmit({
                email,
                upiId,
                e,
                setIsOTPSent,
                wantToBecomeSeller: Boolean(
                  searchParams.get("want_to_become_seller"),
                ),
                setLoading,
              })
            }
            className="flex flex-col items-center gap-2 mt-4"
          >
            <label className="w-full font-medium">Email</label>
            <input
              className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
              id="email"
              name="emailId"
              placeholder="Enter your Email"
              type="email"
              value={email}
              title="Please enter a valid Email ID"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            {searchParams.get("get_upi") && (
              <div className="contents">
                <label className="w-full font-medium">
                  UPI ID{" "}
                  <span className="text-[0.87rem] font-normal">
                    (Ignore if already entered during first signin)
                  </span>
                </label>
                <input
                  className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
                  id="upiId"
                  name="upiId"
                  placeholder="Enter your UPI ID"
                  value={upiId}
                  type="text"
                  pattern={UPI_REGEX.source}
                  title="Please enter a valid UPI ID (e.g., username@bank)"
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}
            <div className="mt-1" />
            <StyledButton
              title="Get OTP"
              action={() => {}}
              heirarchy="primary"
              length="full-width"
              type="submit"
              isLoading={isLoading}
            />
          </form>
        )}

        <p
          onClick={() => navigate("/terms-n-conditions")}
          className="text-[0.8rem] text-center mt-2 cursor-pointer"
        >
          By continuing, you agree to our <u>Terms of Service</u>
        </p>
      </div>
    </div>
  );
};

const emailSchema = z.email();
const otpSchema = z
  .string("Otp is required")
  .length(6, "OTP must be exactly 6 digits")
  .regex(/^\d+$/, "OTP must contain only numbers");

const signInSubmit = async ({
  email,
  upiId,
  e,
  setIsOTPSent,
  wantToBecomeSeller = false,
  setLoading,
}: {
  email: string;
  upiId?: string;
  e: FormEvent;
  setIsOTPSent: (value: boolean) => void;
  wantToBecomeSeller: boolean;
  setLoading: (value: boolean) => void;
}) => {
  e.preventDefault();
  setLoading(true);
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    console.error("Invalid email format");
    return;
  }
  const upiIdResult = upiIdSchema.safeParse(upiId);
  try {
    const response = await apiClient.post("/auth/sign-in", {
      emailId: result.data,
      upiId: upiIdResult.data ? upiIdResult.data : undefined,
      wantToBecomeSeller,
    });
    if (response.status === 200 || response.data.success) {
      setIsOTPSent(true);
    } else {
      console.error("Failed to send OTP", response);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const otpSubmit = async ({
  email,
  otp,
  e,
  setLoading,
  handleClose,
  addUser,
  redirect,
}: {
  email: string;
  otp: string;
  e: FormEvent;
  setLoading: (value: boolean) => void;
  handleClose: () => void;
  addUser: (user: User) => void;
  redirect?: string;
}) => {
  e.preventDefault();

  const result = otpSchema.safeParse(otp);
  if (!result.success) {
    console.error("Invalid otp format");
    return;
  }

  setLoading(true);

  try {
    const response = await apiClient.post("/auth/verify-otp", {
      emailId: email,
      otp: result.data,
    });
    const token = response.data?.data?.token;
    const user = response.data?.data?.user as User;
    if (response.status === 200 && token) {
      document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      addUser(user);
      toast.success("Successfully Logged In!");
      redirect && (window.location.href = redirect);
      handleClose();
    } else {
      toast.error(`Something Went Wrong!, error: ${response.data.message}`);
      console.error("Invalid OTP", response);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

export default SignIn;

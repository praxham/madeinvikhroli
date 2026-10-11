import { isRouteErrorResponse, useRouteError } from "react-router";
import ErrorMascot from "../../assets/mascot/messed-up.svg?react";
import StyledButton from "./styledButton";

const CommonErrorBoundary = () => {
  const error = useRouteError();
  let errorMessage = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-row items-center justify-center min-h-[50vh] p-6 gap-[200px]">
      <ErrorMascot />
      <div className="text-start max-w-md space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight text-red-700">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-16">{errorMessage}</p>
        <StyledButton
          title="Try Again"
          action={() => window.location.reload()}
          heirarchy="primary"
          length="full-width"
        />
      </div>
    </div>
  );
};

export default CommonErrorBoundary;

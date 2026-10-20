import StyledButton from "./styledButton";

const DialogueBox = ({
  title,
  subtitle,
  handleClose,
  rejectFunction,
  confirmFunction,
  isLoading = false,
}: {
  title: string;
  subtitle: string;
  handleClose: () => void;
  rejectFunction?: () => void;
  confirmFunction: () => void;
  isLoading?: boolean;
}) => {
  return (
    <div className="fixed w-screen h-screen text-[1rem] font-normal">
      <div
        onClick={handleClose}
        className="fixed top-0 left-0 w-screen h-screen bg-black/50"
      />
      <div className="fixed w-[calc(100vw-2rem)] lg:w-[500px] max-w-[600px] min-h-[200px] top-[50%] left-[50%] transform-[translate(-50%,-50%)] rounded-[var(--corner-radius)] p-4 flex flex-col items-center gap-2 bg-white text-black border-[var(--clr-border-grey-one)] border-[1px]">
        <h1 className="heading1 w-full">{title}</h1>
        <span className="font-medium text-[var(--clr-grey-two)] w-full">
          {subtitle}
        </span>
        {isLoading ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            width="36"
            height="24"
          >
            <circle
              fill="#000000"
              stroke="#000000"
              stroke-width="2"
              r="15"
              cx="35"
              cy="100"
            >
              <animate
                attributeName="cx"
                calcMode="spline"
                dur="2.2"
                values="35;165;165;35;35"
                keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1"
                repeatCount="indefinite"
                begin="0"
              ></animate>
            </circle>
            <circle
              fill="#000000"
              stroke="#000000"
              stroke-width="2"
              opacity=".8"
              r="15"
              cx="35"
              cy="100"
            >
              <animate
                attributeName="cx"
                calcMode="spline"
                dur="2.2"
                values="35;165;165;35;35"
                keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1"
                repeatCount="indefinite"
                begin="0.05"
              ></animate>
            </circle>
            <circle
              fill="#000000"
              stroke="#000000"
              stroke-width="2"
              opacity=".6"
              r="15"
              cx="35"
              cy="100"
            >
              <animate
                attributeName="cx"
                calcMode="spline"
                dur="2.2"
                values="35;165;165;35;35"
                keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1"
                repeatCount="indefinite"
                begin=".1"
              ></animate>
            </circle>
            <circle
              fill="#000000"
              stroke="#000000"
              stroke-width="2"
              opacity=".4"
              r="15"
              cx="35"
              cy="100"
            >
              <animate
                attributeName="cx"
                calcMode="spline"
                dur="2.2"
                values="35;165;165;35;35"
                keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1"
                repeatCount="indefinite"
                begin=".15"
              ></animate>
            </circle>
            <circle
              fill="#000000"
              stroke="#000000"
              stroke-width="2"
              opacity=".2"
              r="15"
              cx="35"
              cy="100"
            >
              <animate
                attributeName="cx"
                calcMode="spline"
                dur="2.2"
                values="35;165;165;35;35"
                keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1"
                repeatCount="indefinite"
                begin=".2"
              ></animate>
            </circle>
          </svg>
        ) : (
          <div className="w-full grid grid-cols-2 gap-2 mt-auto">
            <StyledButton
              title={rejectFunction ? "Reject" : "Close"}
              action={rejectFunction ? rejectFunction : handleClose}
              length="full-width"
              heirarchy={rejectFunction ? "primary" : "secondary"}
              style={{
                color: rejectFunction ? "white" : "black",
                backgroundColor: rejectFunction && "#b23636",
                borderColor: "black",
              }}
            />
            <StyledButton
              title="Confirm"
              action={confirmFunction}
              length="full-width"
              heirarchy="primary"
              style={{
                backgroundColor: rejectFunction ? "dont-change" : "#b23636",
                color: rejectFunction ? "dont-change" : "white",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueBox;

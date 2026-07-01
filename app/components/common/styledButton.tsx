import type { IButton } from "~/types/common";

const StyledButton = ({ title, action, type, length }: IButton) => {
  return (
    <button
      className={`px-4 py-2 rounded-[var(--corner-radius)] font-semibold ${
        type === "primary"
          ? "bg-[var(--clr-primary)] text-[var(--clr-secondary)]"
          : "text-[var(--clr-secondary)] border-[2px] border-[var(--clr-secondary)]"
      } ${length === "full-width" ? "w-full" : "w-fit"}`}
      onClick={action}
    >
      {title}
    </button>
  );
};

export default StyledButton;

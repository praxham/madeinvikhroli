export type IButton = {
  title: string;
  action: () => void;
  type: "primary" | "secondary";
  length?: "full-width";
};

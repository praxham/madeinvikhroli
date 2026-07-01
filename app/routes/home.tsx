import type { Route } from "./+types/home";
import Hero from "~/components/home/hero";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="max-w-[1240px] mx-auto">
      <Hero />
    </div>
  );
}

import { Link } from "react-router";
import type { HomePageArtifact } from "~/types/common";

const Carousal = ({ artifacts }: { artifacts: HomePageArtifact[] }) => {
  return (
    <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 grid-rows-1 auto-rows-[0] gap-x-4 md:gap-x-8 gap-y-0 pb-3 overflow-hidden">
      {artifacts.map((artifact) => (
        <Link
          key={artifact.id}
          to={`artifacts/${artifact.slug}`}
          className="block w-full sm:max-w-[400px] overflow-hidden shadow-[0_4px_2px_0_rgba(0,0,0,0.5)]"
        >
          {artifact.image && (
            <img
              src={artifact.image}
              alt=""
              loading="lazy"
              className="w-full aspect-square object-cover bg-white z-20"
            />
          )}
        </Link>
      ))}
    </div>
  );
};
// };

export default Carousal;

import { Link } from "react-router";
import type { HomePageArtifact } from "~/types/common";

const Carousal = ({ artifacts }: { artifacts: HomePageArtifact[] }) => {
  const items = artifacts.slice(0, 6); // max 6
  const count = items.length;
  const mid = (count - 1) / 2;
  return (
    <div className="relative w-screen h-screen overflow-hidden mb-[350px] sm:mb-[250px] md:mb-[150px] lg:mb-0">
      <div className="absolute inset-0 [perspective:1600px]">
        {items.map((artifact, index) => {
          const offset = index - mid;
          const scale = 1 - Math.abs(offset) * 0.06;
          return (
            <Link
              key={artifact.id}
              to={`artifacts/${artifact.slug}`}
              className="group absolute block aspect-[4/5] w-[180px] md:w-[16vw] md:min-w-[140px] origin-center
                         overflow-hidden border-b border-r border-black/20 bg-white/40 shadow-xl
                         backdrop-blur-sm transition-all duration-500 ease-out
                         [transform-style:preserve-3d]
                         hover:translate-x-[150px] hover:translate-y-[50px] hover:brightness-110"
              style={{
                left: `calc(50% + ${offset * 7.5}vw)`,
                top: `calc(50% - ${offset * 8}vh)`,
                zIndex: count - index,
                opacity: Math.max(1 - index * 0.06, 0.35),
                transform: `translate(-50%, -50%) skewY(12deg) rotateY(-8deg) scale(${scale})`,
              }}
            >
              {artifact.image && (
                <img
                  src={artifact.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90 transition-opacity duration-500
                             [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]
                             group-hover:opacity-100"
                />
              )}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
// };

export default Carousal;

import { Link } from "react-router";

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between items-center">
      <Link to="/">
        <img src="/assets/common/miv-logo-horizontal.webp" alt="MIV Logo" />
      </Link>

      <div className="bg-[var(--clr-background-one)] flex flex-row gap-6 py-2 px-4 rounded-[var(--corner-radius)] font-medium">
        <Link to="/artifacts">Artifacts</Link>
        <Link to="/members">Members</Link>
      </div>
    </div>
  );
};

export default Navbar;

import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="mb-[1.5rem]">
      <Outlet />
    </div>
  );
};

export default Layout;

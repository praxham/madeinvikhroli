import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="my-[1.5rem]">
      <Outlet />
    </div>
  );
};

export default Layout;

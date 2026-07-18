import { useEffect } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import createSocketInstance from "@/utils/socket";
import { useAppSelector } from "@/store/hook";

const Layout = () => {
  const { user } = useAppSelector((state) => state.user);
  useEffect(() => {
    if (!user?._id) return;

    const socket = createSocketInstance();

    socket.emit("register-user", {
      userId: user._id
    });

    return () => {
      socket.disconnect(); // optional on logout/unmount
    };
  }, [user]);
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto min-h-0">
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;

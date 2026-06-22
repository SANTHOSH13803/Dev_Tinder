import { useEffect } from "react";
import { useGetUserQuery } from "../store/api/user/userApi.slice";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../store/hook";
import { addUser } from "../store/slice/user";

const Layout = () => {
  const { data: userData } = useGetUserQuery();
  const dispatch = useAppDispatch();
  console.log(userData?.data, "USER DATA");
  useEffect(() => {
    if (userData?.data) {
      dispatch(addUser(userData?.data));
    }
  }, [userData]);
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-scroll">
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;

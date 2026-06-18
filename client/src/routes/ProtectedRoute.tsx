import { Navigate, Outlet } from "react-router-dom";
import { useGetUserQuery } from "../store/api/user/userApi.slice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addUser } from "../store/slice/user";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetUserQuery();
  useEffect(() => {
    dispatch(addUser(data));
  }, [data]);
  if (isLoading) {
    return <span className="loading loading-infinity loading-xl"></span>;
  }
  return <>{data ? <Outlet /> : <Navigate to={"/login"} replace />}</>;
};

export default ProtectedRoute;

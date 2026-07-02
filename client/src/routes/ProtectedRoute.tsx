import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useLazyGetUserQuery } from "@/store/api/user/userApi.slice";
import { useDispatch } from "react-redux";
import { addUser } from "@/store/slice/user";
import { LoadingOverlay } from "@/components/LoadingOverlay";

const ProtectedRoute = () => {
  // const data = Cookies.get("token");
  const dispatch = useDispatch();

  const token = Cookies.get("token");

  const navigate = useNavigate();
  const [getUser, { isLoading }] = useLazyGetUserQuery();
  useEffect(() => {
    if (!token) return;

    getUser(undefined, undefined)
      .unwrap()
      .then((res) => dispatch(addUser(res.data)))
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, []);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <LoadingOverlay open={true} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

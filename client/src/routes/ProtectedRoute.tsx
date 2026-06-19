import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const data = Cookies.get("token");
  return <>{data ? <Outlet /> : <Navigate to={"/login"} replace />}</>;
};

export default ProtectedRoute;

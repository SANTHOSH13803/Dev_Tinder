import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const checkAuth = localStorage.getItem("token");
  console.log(checkAuth);
  return <>{checkAuth ? <Outlet /> : <Navigate to={"/login"} replace />}</>;
};

export default ProtectedRoute;

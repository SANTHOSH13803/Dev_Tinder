import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const checkAuth = true;

  return <>{checkAuth ? <Outlet /> : <Navigate to={"/login"} replace />}</>;
};

export default ProtectedRoute;

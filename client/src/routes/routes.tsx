import Layout from "../components/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Signup from "../pages/SignUp";
import ProtectedRoute from "./ProtectedRoute";

const routes = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signUp",
    element: <Signup />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        index: true
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
];
export default routes;

import React from "react";
import Layout from "../components/Layout";
const Feed = React.lazy(() => import("../pages/Feed"));
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Signup from "../pages/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../pages/Profile";

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
        // index: true,
        children: [
          {
            element: <Feed />,
            index: true
          },
          {
            path: "/profile",
            element: <Profile />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
];
export default routes;

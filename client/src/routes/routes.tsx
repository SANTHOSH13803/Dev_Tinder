import React from "react";
import Layout from "../components/Layout";
const Feed = React.lazy(() => import("../pages/Feed"));
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Signup from "../pages/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import Connections from "@/pages/Connections";
import ProfileView from "@/pages/ProfileView";
import ProfileEdit from "@/pages/ProfileEdit";
import ForgotPassword from "@/pages/ForgotPassword";
import EmailSentPage from "@/pages/EmailSentPage";
import ResetPassword from "@/pages/ResetPassword";
import Chat from "@/pages/chat/Chat";

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
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/email-sent",
    element: <EmailSentPage />
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />
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
            element: <ProfileView />
          },
          {
            path: "/profile/edit",
            element: <ProfileEdit />
          },
          {
            path: "/connections",
            element: <Connections />
          },
          {
            path: "/chat/:userId",
            element: <Chat />
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

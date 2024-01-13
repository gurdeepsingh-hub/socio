import React, { useContext } from "react";

import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Rightbar from "./components/rightbar/Rightbar";
import Leftbar from "./components/leftbar/Leftbar";
import Home from "./pages/homepage/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import EditProfile from "./components/editProfile/EditProfile";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to={"/login"} />;
    }
    return children;
  };

  const { darkMode } = useContext(DarkModeContext);

  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <Leftbar />
          <div style={{ flex: 5 }}>
            <Outlet />
          </div>
          <Rightbar />
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: !currentUser ? <Navigate to="/login" /> : <Home />,
        },
        {
          path: "/profile/:id",
          element: !currentUser ? <Navigate to="/login" /> : <Profile />,
        },
        {
          path: "/edit-profile",
          element: !currentUser ? <Navigate to="/login" /> : <EditProfile />,
        },
      ],
    },
    {
      path: "/register",
      element: !currentUser ? <Register /> : <Navigate to="/" />,
    },
    {
      path: "/login",
      element: !currentUser ? <Login /> : <Navigate to="/" />,
    },
    {
      path: "/forgot-password",
      element: !currentUser ? <ForgotPassword /> : <Navigate to="/" />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPassword />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router}>{router}</RouterProvider>
    </div>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Home from "../Pages/Home";
const Gallery = React.lazy(() => import("../Pages/Gallery"));
const Events = React.lazy(() => import("../Pages/Events"));
const Login = React.lazy(() => import("../Pages/Login"));
const Register = React.lazy(() => import("../Pages/Register"));
const About = React.lazy(() => import("../Pages/About"));
const Alumini = React.lazy(() => import("../Pages/Alumini"));
const Blood = React.lazy(() => import("../Pages/Blood"));

import ProtectedRoute from "../utils/ProtectedRoute";

const AdminPanel = React.lazy(() => import("../Pages/AdminPanel"));
const RegisteredEvents = React.lazy(() => import("../Pages/RegisteredEvents"));
import AuthRoute from "../utils/AuthRoute";
import { getUser } from "../utils/auth";
import PleaseLogin from "../Pages/PleaseLogin";
import ForgotPassword from "../Components/ForgotPassword";
const UserDetails = React.lazy(() => import("../Pages/UserDetails"));
const Team = React.lazy(() => import("../Pages/Team"));
const Faculty = React.lazy(() => import("../Pages/Faculty"));
const Zrotriya = React.lazy(() => import("../Pages/Zrotriya"));

const NRoutes = () => {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  return (
    <React.Suspense fallback={null}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/events" element={<Events />} />
      <Route path="/about" element={<About />} />
      <Route path="/blood" element={<Blood />} />
      <Route path="/alumini" element={<Alumini />} />
      <Route path="/team" element={<Team />} />
      <Route path="/faculty" element={<Faculty />} />
      <Route path="/zrotriya" element={<Zrotriya />} />

      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/registered-events"
        element={
          <ProtectedRoute>
            <RegisteredEvents />
          </ProtectedRoute>
        }
      />

      <Route path="/please-login" element={<PleaseLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            {isAdmin ? <AdminPanel /> : <Navigate to="/" />}
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/user-details/:email"
        element={
          <ProtectedRoute>
            {isAdmin ? <UserDetails /> : <Navigate to="/" />}
          </ProtectedRoute>
        }
      />
    </Routes>
    </React.Suspense>
  );
};

export default NRoutes;

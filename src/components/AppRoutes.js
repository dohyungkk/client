import React, { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import VehiclesPage from "./VehiclesPage";

const AppRoutes = () => {
  const [user, setUser] = useState(() => {
    // To prevent logging out automatically when refreshing with localStorage
    const storedUser = localStorage.getItem("session");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  // Authenticating user before navigating to vehicles page
  function ProtectedRoute({ user, children }) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  function LogOut() {
    // Clearing user and localStorage when logged out so an user can log in again
    setUser(null);
    localStorage.removeItem("session")
    navigate("/");
  }

  // Extra error page when a problem with login occurs
  function NoMatch() {
    return (
      <div>
        <h2>404: Page Not Found</h2>
        <p>Login failed. Please restart the app</p>
      </div>
    );
  }

  return (
    <>
      <nav style={{ margin: 10 }}>
        {user && (
          <Link to="/vehicles" style={{ padding: 5 }}>
            Vehicles
          </Link>
        )}
        {!user && (
          <Link to="/" style={{ padding: 5 }}>
            Login
          </Link>
        )}
        {user && (
          <span onClick={LogOut} style={{ padding: 5, cursor: "pointer" }}>
            Logout
          </span>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={setUser} />} />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute user={user}>
              <VehiclesPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
import React, { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import VehiclesPage from "./VehiclesPage";

const AppRoutes = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("session");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  function ProtectedRoute({ user, children }) {
    console.log(user)
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }

  function LogOut() {
    setUser(null);
    navigate("/");
  }

  function NoMatch() {
    return (
      <div style={{ padding: 20 }}>
        <h2>404: Page Not Found</h2>
        <p>Email address or password does not match database</p>
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

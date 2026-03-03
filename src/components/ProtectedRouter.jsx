// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);

  if (!user) {
    // Not logged in → redirect to login page
    return <Navigate to="/auth" replace />;
  }
  
  // Logged in → show the page
  return children;
}

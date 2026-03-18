import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // User is not logged in, redirect to SignIn
    return <Navigate to="/signin" replace />;
  }

  // User is logged in, render the page
  return children;
};

export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingScreen from "../components/common/LoadingScreen";

export default function PublicRoute({ children }) {

  const { user, loading } = useAuth();

  if (loading) {
   return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
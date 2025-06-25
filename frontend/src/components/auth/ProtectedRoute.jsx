import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../Layout/Loader";

const ProtectedRoute = ({ admin, children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);

  if (loading) return <Loader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (admin && user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function AdminRoute({ children }) {

  const user = useAuthStore(
    (state) => state.user
  );

  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  if (!user.is_staff) {
    return <Navigate to="/complaints/new" />;
  }

  return children;
}
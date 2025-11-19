import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextHelper";

export default function RoleRoute({ children, allowed  }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  //if (user.role !== role) return <Navigate to="/" />;
  if (!allowed.includes(user.role)) return <Navigate to="/" />;

  return children;
}

import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/user/useUserStore";
import Loader from "@/components/loaders/Loader";

export default function ConnectedRoute({ children }) {
  const user = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);
  const location = useLocation();

  if (!isHydrated) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;
  const name = user?.metadata?.name || user?.display_name;

  if (!name && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

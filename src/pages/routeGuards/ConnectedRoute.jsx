import Loader from "@/components/loaders/Loader";
import { useUserStore } from "@/store/user/useUserStore";
import { Navigate } from "react-router-dom";

export default function ConnectedRoute({ children }) {
  const user = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);
  if (!isHydrated) return <Loader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

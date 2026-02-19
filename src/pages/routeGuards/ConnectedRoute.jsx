import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/user/useUserStore";
import Loader from "@/components/loaders/Loader";

export default function ConnectedRoute({ children }) {
  const user = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);
  const location = useLocation();

  if (!isHydrated) return <Loader />;

  // 1. Pas connecté ? Dehors.
  if (!user) return <Navigate to="/login" replace />;
  // console.log("user22", user)

  // 2. Connecté mais pas de NOM ?
  // On vérifie s'il n'est pas déjà sur la page profil pour éviter une boucle infinie
  const name = user?.display_name;

  if (!name && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

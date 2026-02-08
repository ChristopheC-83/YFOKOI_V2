import ListDetail from "@/pages/connectedPages/ListDetail/ListDetail";
import Lists from "@/pages/connectedPages/Lists/Lists";
import ListSettings from "@/pages/connectedPages/ListSettings/ListSettings";
import Profile from "@/pages/connectedPages/Profile/Profile";
import ConnectedRoute from "@/pages/routeGuards/ConnectedRoute";

export const privateRoutes = [
  //  Dans la navbar
  {
    path: "/lists",
    element: (
      <ConnectedRoute>
        <Lists />
      </ConnectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ConnectedRoute>
        <Profile />
      </ConnectedRoute>
    ),
  },
  //  pas à partir de la navbar
  {
    path: "/list/:id", // La route dynamique pour une liste donnée
    element: (
      <ConnectedRoute>
        <ListDetail />
      </ConnectedRoute>
    ),
  },
  {
    path: "/list/:id/settings", // La route dynamique pour les détails d'une liste
    element: (
      <ConnectedRoute>
        <ListSettings />
      </ConnectedRoute>
    ),
  },
];
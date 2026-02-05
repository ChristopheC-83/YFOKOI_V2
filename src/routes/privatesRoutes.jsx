import Lists from "@/pages/connectedPages/Lists";
import Profile from "@/pages/connectedPages/Profile";
import ConnectedRoute from "@/pages/routeGuards/ConnectedRoute";

export const privateRoutes = [
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
];
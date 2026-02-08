import Lists from "@/pages/connectedPages/Lists/Lists";
import Profile from "@/pages/connectedPages/Profile/Profile";
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
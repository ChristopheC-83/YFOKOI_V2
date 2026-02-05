import Home from "@/pages/noConnectedPages/Home";
import Login from "@/pages/noConnectedPages/Login";
import NoConnectedRoute from "@/pages/routeGuards/NoConnectedRoute";

export const publicRoutes = [
  {
    path: "/",
    element: (
      <NoConnectedRoute>
        <Home />
      </NoConnectedRoute>
    ),
  },
  {
    path: "login",
    element: (
      <NoConnectedRoute>
        <Login />
      </NoConnectedRoute>
    ),
  },
];

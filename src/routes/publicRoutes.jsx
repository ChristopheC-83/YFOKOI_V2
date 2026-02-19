import Home from "@/pages/noConnectedPages/Home/Home";
import { Login } from "@/pages/noConnectedPages/Login/Login";
import Register from "@/pages/noConnectedPages/Register/Register";
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
    path: "/login",
    element: (
      <NoConnectedRoute>
        <Login />
      </NoConnectedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <NoConnectedRoute>
        <Register />
      </NoConnectedRoute>
    ),
  },
];

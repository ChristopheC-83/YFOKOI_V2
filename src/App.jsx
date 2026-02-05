import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { privateRoutes } from "./routes/privatesRoutes";
import { publicRoutes } from "./routes/publicRoutes";
import Layout from "./pages/layout/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [...publicRoutes, ...privateRoutes],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

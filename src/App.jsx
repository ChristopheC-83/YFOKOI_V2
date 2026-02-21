import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";
import { privateRoutes } from "./routes/privatesRoutes";
import { publicRoutes } from "./routes/publicRoutes";
import Layout from "./pages/layout/Layout";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      ...publicRoutes,
      ...privateRoutes,
      {
        path: "*",
        element: <NotFound />, 
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

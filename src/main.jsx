import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./components/provider/theme-provider";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ThemeProvider defaultTheme="dark">
     {/* <ThemeProvider defaultTheme="light"> */}
    <App />
  </ThemeProvider>,
  // </StrictMode>,
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import { router } from "./routes/router.tsx";
import { RouterProvider } from "@tanstack/react-router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

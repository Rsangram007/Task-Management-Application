

import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { TaskList } from "@/pages/TaskList";
import { AuthPage } from "@/pages/auth/AuthPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter(
  [
    {
      path: "/auth",
      element: <AuthPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/tasks",
          element: <TaskList />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,  
    },
  }
);

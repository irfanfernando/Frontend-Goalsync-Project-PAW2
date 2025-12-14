import { createBrowserRouter, Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ui/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        lazy: () =>
          import("../pages/public/Landing").then(m => ({
            Component: m.default,
          })),
      },
      {
        path: "signin",
        lazy: () =>
          import("../pages/auth/SignIn/SignIn").then(m => ({
            Component: m.default,
          })),
      },
      {
        path: "signup",
        lazy: () =>
          import("../pages/auth/SignUp/SignUp").then(m => ({
            Component: m.default,
          })),
      },
    ],
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        lazy: () =>
          import("../pages/goals/GoalList").then(m => ({
            Component: m.default,
          })),
      },
      {
        path: "goals",
        lazy: () =>
          import("../pages/goals/GoalList").then(m => ({
            Component: m.default,
          })),
      },
      {
        path: "goals/add",
        lazy: () =>
          import("../pages/goals/AddGoal").then(m => ({
            Component: m.default,
          })),
      },
      {
        path: "goals/:id",
        lazy: () =>
          import("../pages/goals/GoalDetail").then(m => ({
            Component: m.default,
          })),
      },
    ],
  },
]);

export default router;

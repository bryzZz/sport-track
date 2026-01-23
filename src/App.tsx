import React from "react";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { WorkoutTemplates } from "./pages/WorkoutTemplates";
import { CreateWorkoutTemplate } from "./pages/CreateWorkoutTemplate";
import { WorkoutStats } from "./pages/WorkoutStats";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WorkoutTemplates />,
  },
  {
    path: "/create",
    element: <CreateWorkoutTemplate />,
  },
  {
    path: "/stats",
    element: <WorkoutStats />,
  },
]);

export const App: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <RouterProvider router={router} />
    </div>
  );
};

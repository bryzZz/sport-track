import { CreateWorkoutTemplate } from "pages/CreateWorkoutTemplate";
import { EditWorkoutTemplate } from "pages/EditWorkoutTemplate";
import { WorkoutStats } from "pages/WorkoutStats";
import { WorkoutTemplates } from "pages/WorkoutTemplates";
import React from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WorkoutTemplates />,
  },
  {
    path: "/templates/create",
    element: <CreateWorkoutTemplate />,
  },
  {
    path: "/templates/:id/edit",
    element: <EditWorkoutTemplate />,
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

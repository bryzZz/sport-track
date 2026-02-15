import React from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { CreateWorkoutTemplate } from "pages/CreateWorkoutTemplate";
import { EditWorkoutTemplate } from "pages/EditWorkoutTemplate";
import { WorkoutPerform } from "pages/WorkoutPerform";
import { WorkoutStats } from "pages/WorkoutStats";
import { WorkoutTemplates } from "pages/WorkoutTemplates";

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
    path: "/workout/perform",
    element: <WorkoutPerform />,
  },
  {
    path: "/stats",
    element: <WorkoutStats />,
  },
]);

export const App: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-8">
      <RouterProvider router={router} />
    </div>
  );
};

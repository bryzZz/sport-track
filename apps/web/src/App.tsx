import React from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { AppLayout } from "components/AppLayout";
import { CreateWorkoutTemplate } from "pages/CreateWorkoutTemplate";
import { EditWorkoutTemplate } from "pages/EditWorkoutTemplate";
import { WorkoutPerform } from "pages/WorkoutPerform";
import { WorkoutStats } from "pages/WorkoutStats";
import { WorkoutTemplates } from "pages/WorkoutTemplates";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <WorkoutTemplates />,
      },
      {
        path: "templates/create",
        element: <CreateWorkoutTemplate />,
      },
      {
        path: "templates/edit",
        element: <EditWorkoutTemplate />,
      },
      {
        path: "workout/perform",
        element: <WorkoutPerform />,
      },
      {
        path: "stats",
        element: <WorkoutStats />,
      },
    ],
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

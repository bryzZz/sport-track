import React from "react";

import { WorkoutTemplateForm } from "components/WorkoutTemplateForm";

export const CreateWorkoutTemplate: React.FC = () => {
  return (
    <div>
      <h1 className="mb-6 text-4xl">Create Workout Template</h1>

      <WorkoutTemplateForm />
    </div>
  );
};

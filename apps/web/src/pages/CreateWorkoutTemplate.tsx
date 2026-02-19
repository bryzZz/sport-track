import React from "react";

import {
  WorkoutTemplateForm,
  type WorkoutTemplateFormValues,
} from "components/WorkoutTemplateForm";

import {
  type UpsertWorkoutTemplatePayload,
  useCreateWorkoutTemplate,
} from "../api/workout-templates";

const defaultValues: WorkoutTemplateFormValues = {
  name: "",
  exercises: [],
};

export const CreateWorkoutTemplate: React.FC = () => {
  const { mutateAsync: createWorkoutTemplate } = useCreateWorkoutTemplate();

  const handleSubmit = async (values: WorkoutTemplateFormValues) => {
    const payload: UpsertWorkoutTemplatePayload = {
      name: values.name.trim(),
      exercises: values.exercises.map((exercise, exerciseIndex) => ({
        exerciseTypeId: exercise.exerciseTypeId,
        orderIndex: exerciseIndex,
        weightUnit: exercise.weightUnit,
        comment:
          exercise.comment.trim().length > 0 ? exercise.comment.trim() : undefined,
        sets: exercise.sets.map((setItem) => ({
          reps: setItem.reps,
          partialReps: setItem.partialReps,
          weight: setItem.weight,
        })),
      })),
    };

    await createWorkoutTemplate(payload);

    window.alert("Шаблон создан.");
    window.history.back();
  };

  return (
    <div>
      <h1 className="mb-6 text-4xl">Create Workout Template</h1>

      <WorkoutTemplateForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="Создать шаблон"
      />
    </div>
  );
};

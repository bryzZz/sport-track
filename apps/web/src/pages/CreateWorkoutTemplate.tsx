import React from "react";
import { Link } from "react-router";

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
          exercise.comment.trim().length > 0
            ? exercise.comment.trim()
            : undefined,
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

    return true;
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link to="/">
          <button
            className="cursor-pointer rounded border px-6 py-2"
            type="button"
          >
            Back
          </button>
        </Link>
        <h1 className="text-3xl">Create Workout Template</h1>
      </div>

      <WorkoutTemplateForm
        defaultValues={defaultValues}
        draftStorageKey="workout-template:create:draft:v1"
        onSubmit={handleSubmit}
        submitLabel="Создать шаблон"
      />
    </div>
  );
};

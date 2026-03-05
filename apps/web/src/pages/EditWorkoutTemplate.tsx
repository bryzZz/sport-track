import React from "react";

import { useRememberedTemplateId } from "utils/hooks/useRememberedTemplateId";

import {
  WorkoutTemplateForm,
  type WorkoutTemplateFormValues,
} from "components/WorkoutTemplateForm";

import {
  type UpsertWorkoutTemplatePayload,
  useGetWorkoutTemplate,
  useUpdateWorkoutTemplate,
  type WorkoutTemplate,
} from "../api/workout-templates";

const createInitialValues = (
  template: WorkoutTemplate,
): WorkoutTemplateFormValues => ({
  name: template.name,
  exercises: template.exercises.map((exercise) => ({
    exerciseTypeId: exercise.exerciseTypeId,
    weightUnit: exercise.weightUnit,
    comment: exercise.comment ?? "",
    sets: exercise.sets.map((setItem) => ({
      reps: setItem.reps,
      partialReps: setItem.partialReps ?? undefined,
      weight: Number(setItem.weight),
    })),
  })),
});

export const EditWorkoutTemplate: React.FC = () => {
  const templateId = useRememberedTemplateId("last-template-id:template") ?? "";

  const {
    data: template,
    isLoading,
    isError,
  } = useGetWorkoutTemplate(templateId);
  const { mutateAsync: updateWorkoutTemplate } =
    useUpdateWorkoutTemplate(templateId);

  if (!templateId) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Edit Workout</h1>
        <p>Template id is required.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Edit Workout</h1>
        <p>Loading template...</p>
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Edit Workout</h1>
        <p>Workout template not found.</p>
      </div>
    );
  }

  const defaultValues = createInitialValues(template);

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

    await updateWorkoutTemplate(payload);

    window.alert("Template updated.");
    window.history.back();

    return true;
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl">Edit Workout</h1>

      <WorkoutTemplateForm
        defaultValues={defaultValues}
        draftStorageKey={`workout-template:edit:draft:v1:${templateId}`}
        onSubmit={handleSubmit}
        submitLabel="Save Template"
      />
    </div>
  );
};

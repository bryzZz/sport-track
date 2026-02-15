import React from "react";
import { useSearchParams } from "react-router";

import {
  WorkoutPerformForm,
  type WorkoutPerformFormValues,
} from "components/WorkoutPerformForm";

import {
  type CreateWorkoutSessionPayload,
  useCreateWorkoutSession,
} from "../api/workout-sessions";
import { useGetWorkoutTemplate, type WorkoutTemplate } from "../api/workout-templates";

const createInitialValues = (
  template: WorkoutTemplate,
): WorkoutPerformFormValues => ({
  rpe: 7,
  exercises: template.exercises.map((exercise) => ({
    exerciseTypeId: exercise.exerciseTypeId,
    templateExerciseId: exercise.id,
    comment: exercise.comment ?? "",
    sets: exercise.sets.map((set) => ({
      reps: set.reps,
      partialReps: set.partialReps ?? undefined,
      weight: Number(set.weight),
      isCompleted: false,
    })),
  })),
});

export const WorkoutPerform: React.FC = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");
  const { data: template, isLoading, isError } = useGetWorkoutTemplate(
    templateId ?? "",
  );
  const { mutateAsync: createWorkoutSession } = useCreateWorkoutSession();

  if (!templateId) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Выполнение тренировки</h1>
        <p>Не передан идентификатор шаблона.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Выполнение тренировки</h1>
        <p>Загрузка шаблона...</p>
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Выполнение тренировки</h1>
        <p>Шаблон тренировки не найден.</p>
      </div>
    );
  }

  const initialValues = createInitialValues(template);

  const handleSubmit = async (values: WorkoutPerformFormValues) => {
    const payload: CreateWorkoutSessionPayload = {
      templateId: template.id,
      rpe: values.rpe,
      performedAt: new Date().toISOString(),
      exercises: values.exercises.map((exercise, exerciseIndex) => ({
        exerciseTypeId: exercise.exerciseTypeId,
        templateExerciseId: exercise.templateExerciseId,
        orderIndex: exerciseIndex,
        comment:
          exercise.comment.trim().length > 0 ? exercise.comment.trim() : null,
        sets: exercise.sets.map((set) => ({
          reps: set.reps,
          partialReps: set.partialReps,
          weight: set.weight,
          isCompleted: set.isCompleted,
        })),
      })),
    };

    await createWorkoutSession(payload);

    window.alert("Тренировка сохранена.");
    window.history.back();
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button
          className="cursor-pointer rounded border px-6 py-2"
          type="button"
          onClick={() => window.history.back()}
        >
          Back
        </button>
        <h1 className="text-4xl">{template.name} Perform</h1>
      </div>

      <WorkoutPerformForm
        template={template}
        defaultValues={initialValues}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

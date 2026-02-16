import React from "react";
import { useParams } from "react-router";

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
    comment: exercise.comment ?? "",
    sets: exercise.sets.map((setItem) => ({
      reps: setItem.reps,
      partialReps: setItem.partialReps ?? undefined,
      weight: Number(setItem.weight),
    })),
  })),
});

export const EditWorkoutTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const templateId = id ?? "";
  const { data: template, isLoading, isError } = useGetWorkoutTemplate(templateId);
  const { mutateAsync: updateWorkoutTemplate } = useUpdateWorkoutTemplate(templateId);

  if (!id) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Редактирование тренировки</h1>
        <p>Не передан идентификатор шаблона.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Редактирование тренировки</h1>
        <p>Загрузка шаблона...</p>
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Редактирование тренировки</h1>
        <p>Шаблон тренировки не найден.</p>
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
        comment:
          exercise.comment.trim().length > 0 ? exercise.comment.trim() : undefined,
        sets: exercise.sets.map((setItem) => ({
          reps: setItem.reps,
          partialReps: setItem.partialReps,
          weight: setItem.weight,
        })),
      })),
    };

    await updateWorkoutTemplate(payload);

    window.alert("Шаблон обновлен.");
    window.history.back();
  };

  return (
    <div>
      <h1 className="mb-6 text-4xl">Редактирование тренировки</h1>

      <WorkoutTemplateForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="Сохранить шаблон"
      />
    </div>
  );
};

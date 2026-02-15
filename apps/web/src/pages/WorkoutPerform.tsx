import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import {
  WorkoutPerformForm,
  type WorkoutPerformFormValues,
} from "components/WorkoutPerformForm";

import type { WorkoutTemplateDto } from "../api/types";
import { workoutSessionsApi } from "../api/workoutSessionsApi";
import { workoutTemplatesApi } from "../api/workoutTemplatesApi";

const createInitialValues = (
  template: WorkoutTemplateDto,
): WorkoutPerformFormValues => ({
  rpe: 7,
  exercises: template.exercises.map((exercise) => ({
    exerciseTypeId: exercise.exerciseTypeId,
    templateExerciseId: exercise.id,
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
  const [template, setTemplate] = useState<WorkoutTemplateDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!templateId) {
      setIsLoading(false);
      setTemplate(null);
      setErrorMessage("");

      return;
    }

    const handleLoadTemplate = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const templateData = await workoutTemplatesApi.getById(templateId);
        setTemplate(templateData);
      } catch {
        setErrorMessage("Шаблон тренировки не найден.");
      } finally {
        setIsLoading(false);
      }
    };

    void handleLoadTemplate();
  }, [templateId]);

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

  if (errorMessage || !template) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Выполнение тренировки</h1>
        <p>{errorMessage || "Шаблон тренировки не найден."}</p>
      </div>
    );
  }

  const initialValues = createInitialValues(template);

  const handleSubmit = async (values: WorkoutPerformFormValues) => {
    await workoutSessionsApi.create({
      templateId: template.id,
      rpe: values.rpe,
      performedAt: new Date().toISOString(),
      exercises: values.exercises.map((exercise, exerciseIndex) => ({
        exerciseTypeId: exercise.exerciseTypeId,
        templateExerciseId: exercise.templateExerciseId,
        orderIndex: exerciseIndex,
        sets: exercise.sets.map((set) => ({
          reps: set.reps,
          partialReps: set.partialReps,
          weight: set.weight,
          isCompleted: set.isCompleted,
        })),
      })),
    });

    window.alert("Тренировка сохранена.");
    window.history.back();
  };

  const handleUpdateExerciseComment = async (
    templateExerciseId: string,
    comment: string | null,
  ) => {
    await workoutTemplatesApi.updateExerciseComment(
      template.id,
      templateExerciseId,
      { comment },
    );

    setTemplate((previousTemplate) => {
      if (!previousTemplate) {
        return previousTemplate;
      }

      return {
        ...previousTemplate,
        exercises: previousTemplate.exercises.map((exercise) => {
          if (exercise.id !== templateExerciseId) {
            return exercise;
          }

          return {
            ...exercise,
            comment,
          };
        }),
      };
    });
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
        onUpdateExerciseComment={handleUpdateExerciseComment}
      />
    </div>
  );
};

import React from "react";
import { useSearchParams } from "react-router";

import type { WorkoutPerformExercise, WorkoutTemplateNew } from "constants";

import {
  WorkoutPerformForm,
  type WorkoutPerformFormValues,
} from "components/WorkoutPerformForm";
import { workoutTemplatesNew } from "constants";

type RealWorkoutRecord = {
  id: string;
  performedAt: string;
  templateId: string;
  rpe: number;
  exercises: WorkoutPerformExercise[];
};

const createInitialValues = (template: WorkoutTemplateNew) => ({
  rpe: 7,
  exercises: template.exercises.map((exercise) => ({
    exerciseId: exercise.exerciseId,
    sets: exercise.sets.map((set) => ({
      reps: set.reps,
      partialReps: set.partialReps,
      weight: set.weight,
      isCompleted: false,
    })),
    comment: exercise.comment,
  })),
});

export const WorkoutPerform: React.FC = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  if (!templateId) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Выполнение тренировки</h1>
        <p>Не передан идентификатор шаблона.</p>
      </div>
    );
  }

  const template = workoutTemplatesNew.find((item) => item.id === templateId);

  if (!template) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Выполнение тренировки</h1>
        <p>Шаблон тренировки не найден.</p>
      </div>
    );
  }

  const initialValues = createInitialValues(template);

  const handleSubmit = (values: WorkoutPerformFormValues) => {
    const record: RealWorkoutRecord = {
      id: `record-${Date.now()}`,
      performedAt: new Date().toISOString(),
      templateId: template.id,
      rpe: values.rpe,
      exercises: values.exercises,
    };

    console.log(record);
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

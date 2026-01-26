import { WorkoutTemplateForm } from "components/WorkoutTemplateForm";
import { workoutTemplates } from "constants";
import React from "react";
import { useParams } from "react-router";

export const EditWorkoutTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Редактирование тренировки</h1>
        <p>Не передан идентификатор шаблона.</p>
      </div>
    );
  }

  const template = workoutTemplates.find((item) => item.id === id);

  if (!template) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Редактирование тренировки</h1>
        <p>Шаблон тренировки не найден.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-4xl">Edit Workout Template</h1>

      <WorkoutTemplateForm defaultValues={template} />
    </div>
  );
};

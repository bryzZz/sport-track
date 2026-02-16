import React from "react";
import { useFormContext } from "react-hook-form";

import { useGetExerciseTypes } from "api/exercise-types";

import type { WorkoutTemplateFormValues } from "../WorkoutTemplateForm";

import { Sets } from "./Sets";

interface ExerciseItemProps {
  index: number;
  onRemove: () => void;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = (props) => {
  const { index, onRemove } = props;

  const { register } = useFormContext<WorkoutTemplateFormValues>();
  const {
    data: exerciseTypes = [],
    isLoading: isExerciseTypesLoading,
    isError: isExerciseTypesError,
  } = useGetExerciseTypes();

  return (
    <div className="w-full rounded border border-zinc-600 p-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          aria-label="Переместить упражнение"
          className="exercise-drag-handle cursor-grab rounded border px-2 py-1 text-sm active:cursor-grabbing"
          type="button"
        >
          Drag
        </button>
        <select
          className="min-w-55 flex-1 rounded border border-zinc-600 bg-transparent px-2 py-1"
          {...register(`exercises.${index}.exerciseTypeId`)}
          disabled={isExerciseTypesLoading || isExerciseTypesError}
        >
          <option value="">
            {isExerciseTypesLoading
              ? "Загрузка упражнений..."
              : isExerciseTypesError
                ? "Ошибка загрузки упражнений"
                : "Выберите упражнение"}
          </option>
          {exerciseTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <button
          className="cursor-pointer rounded border px-3 py-1 text-sm"
          type="button"
          onClick={onRemove}
        >
          Remove Exercise
        </button>
      </div>

      <Sets exerciseIndex={index} />

      <div className="mt-2">
        <textarea
          className="w-full rounded border border-zinc-600 bg-transparent px-2 py-1"
          placeholder="Комментарий"
          rows={2}
          {...register(`exercises.${index}.comment`)}
        />
      </div>
    </div>
  );
};

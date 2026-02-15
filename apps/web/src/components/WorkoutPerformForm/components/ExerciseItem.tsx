import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type {
  WorkoutPerformFormValues,
  WorkoutPerformTemplateExercise,
} from "../types";

import { Sets } from "./Sets";

type ExerciseItemProps = {
  index: number;
  planExercise?: WorkoutPerformTemplateExercise;
  onUpdateExerciseComment: (
    templateExerciseId: string,
    comment: string | null,
  ) => Promise<void>;
};

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  index,
  planExercise,
  onUpdateExerciseComment,
}) => {
  const { control, setValue } = useFormContext<WorkoutPerformFormValues>();
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [isCommentSaving, setIsCommentSaving] = useState(false);

  const exerciseTypeId =
    useWatch({
      control,
      name: `exercises.${index}.exerciseTypeId`,
    }) ??
    planExercise?.exerciseTypeId ??
    "";

  const exerciseName =
    planExercise?.exerciseType.name ??
    (exerciseTypeId ? `Упражнение ${exerciseTypeId}` : "Неизвестное упражнение");

  const sets =
    useWatch({
      control,
      name: `exercises.${index}.sets`,
    }) ?? [];

  const isAllCompleted =
    sets.length > 0 && sets.every((setItem) => setItem.isCompleted);

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const shouldCompleteAll = event.target.checked;

    if (!sets.length) {
      return;
    }

    for (let setIndex = 0; setIndex < sets.length; setIndex += 1) {
      setValue(
        `exercises.${index}.sets.${setIndex}.isCompleted`,
        shouldCompleteAll,
      );
    }
  };

  const handleStartCommentEdit = () => {
    setCommentDraft(planExercise?.comment ?? "");
    setIsCommentEditing(true);
  };

  const handleCancelCommentEdit = () => {
    setIsCommentEditing(false);
    setCommentDraft("");
  };

  const handleSaveComment = async () => {
    if (!planExercise?.id) {
      return;
    }

    try {
      setIsCommentSaving(true);
      const normalizedComment = commentDraft.trim();

      await onUpdateExerciseComment(
        planExercise.id,
        normalizedComment.length > 0 ? normalizedComment : null,
      );
      setIsCommentEditing(false);
    } finally {
      setIsCommentSaving(false);
    }
  };

  return (
    <div className="border-b pb-3">
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-2xl">{exerciseName}</h2>
        {isCommentEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              className="w-full rounded border px-3 py-2 text-sm"
              value={commentDraft}
              rows={2}
              onChange={(event) => setCommentDraft(event.target.value)}
            />
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer rounded border px-3 py-1 text-sm"
                type="button"
                disabled={isCommentSaving}
                onClick={() => {
                  void handleSaveComment();
                }}
              >
                Сохранить
              </button>
              <button
                className="cursor-pointer rounded border px-3 py-1 text-sm"
                type="button"
                disabled={isCommentSaving}
                onClick={handleCancelCommentEdit}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {planExercise?.comment ? (
              <p className="text-sm text-slate-500">{planExercise.comment}</p>
            ) : (
              <p className="text-sm text-slate-400">Комментарий не задан</p>
            )}
            <button
              className="cursor-pointer rounded border px-2 py-0.5 text-xs"
              type="button"
              onClick={handleStartCommentEdit}
            >
              Редактировать
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm">
          <div className="grid grid-cols-[40px_1fr_90px_90px_48px] gap-2">
            <div className="py-1 text-center font-medium">Set</div>
            <div className="py-1 text-center font-medium">Plan</div>
            <div className="py-1 text-center font-medium">Kg</div>
            <div className="py-1 text-center font-medium">Reps</div>
            <div className="flex items-center justify-center">
              <input
                aria-label="Отметить все подходы"
                type="checkbox"
                checked={isAllCompleted}
                onChange={handleToggleAll}
              />
            </div>
          </div>

          <Sets exerciseIndex={index} planSets={planExercise?.sets ?? []} />
        </div>
      </div>
    </div>
  );
};

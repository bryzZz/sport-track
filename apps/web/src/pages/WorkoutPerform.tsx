import { useSearchParams } from "react-router";

import { useApiKeepAliveOnFocus } from "utils/hooks/useApiKeepAliveOnFocus";

import {
  WorkoutPerformForm,
  type WorkoutPerformFormValues,
} from "components/WorkoutPerformForm";

import {
  type CreateWorkoutSessionPayload,
  useCreateWorkoutSession,
  type WorkoutSessionTemplateUpdateExercisePayload,
} from "../api/workout-sessions";
import {
  useGetWorkoutTemplate,
  type WorkoutTemplate,
} from "../api/workout-templates";

const createInitialValues = (
  template: WorkoutTemplate,
): WorkoutPerformFormValues => ({
  rpe: 7,
  exercises: template.exercises.map((exercise) => ({
    templateExerciseId: exercise.id,
    sets: exercise.sets.map((set) => ({
      reps: set.reps,
      partialReps: set.partialReps ?? undefined,
      weight: Number(set.weight),
      isCompleted: false,
    })),
    template: {
      comment: exercise.comment ?? "",
      weightUnit: exercise.weightUnit,
      sets: exercise.sets.map((set) => ({
        orderIndex: set.orderIndex,
        reps: set.reps,
        partialReps: set.partialReps ?? undefined,
        weight: Number(set.weight),
      })),
    },
  })),
});

const normalizeComment = (comment: string | null | undefined) => {
  return comment?.trim() || undefined;
};

export const WorkoutPerform: React.FC = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  const {
    data: template,
    isLoading,
    isError,
  } = useGetWorkoutTemplate(templateId ?? "", {
    enabled: !!templateId,
  });

  const {
    mutateAsync: createWorkoutSession,
    isPending: isCreatingWorkoutSession,
  } = useCreateWorkoutSession();

  useApiKeepAliveOnFocus({
    enabled: !!templateId,
  });

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
    if (isCreatingWorkoutSession) {
      return false;
    }

    const changedTemplateExercises: WorkoutSessionTemplateUpdateExercisePayload[] =
      values.exercises.flatMap((exercise, exerciseIndex) => {
        const templateExercise = template.exercises[exerciseIndex];

        const nextComment = normalizeComment(exercise.template.comment);
        const currentComment = normalizeComment(templateExercise.comment);
        const isCommentChanged = nextComment !== currentComment;
        const isWeightUnitChanged =
          exercise.template.weightUnit !== templateExercise.weightUnit;

        if (!isCommentChanged && !isWeightUnitChanged) {
          return [];
        }

        return {
          id: exercise.templateExerciseId,
          weightUnit: exercise.template.weightUnit,
          sets: exercise.template.sets,
          comment: nextComment,
        };
      });

    const payload: CreateWorkoutSessionPayload = {
      templateId: template.id,
      rpe: values.rpe,
      performedAt: new Date().toISOString(),
      exercises: values.exercises.map((exercise, exerciseIndex) => ({
        templateExerciseId: exercise.templateExerciseId,
        orderIndex: exerciseIndex,
        weightUnit: exercise.template.weightUnit,
        comment: normalizeComment(exercise.template.comment),
        sets: exercise.sets.map((set) => ({
          reps: set.reps,
          partialReps: set.partialReps,
          weight: set.weight,
          isCompleted: set.isCompleted,
        })),
      })),
      templateUpdates: {
        exercises: changedTemplateExercises,
      },
    };

    try {
      await createWorkoutSession(payload);

      window.alert("Тренировка сохранена.");
      window.history.back();

      return true;
    } catch {
      window.alert(
        "Не удалось сохранить тренировку. Проверь соединение и попробуй снова. Черновик сохранен локально.",
      );

      return false;
    }
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

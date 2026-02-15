import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  getWorkoutTemplate,
  getWorkoutTemplates,
  updateWorkoutTemplateExerciseComment,
} from "./api";
import type {
  UpdateWorkoutTemplateExerciseCommentPayload,
  WorkoutTemplate,
} from "./types";

export const useGetWorkoutTemplates = () => {
  return useQuery({
    queryKey: ["workout-templates"],
    queryFn: getWorkoutTemplates,
  });
};

export const useGetWorkoutTemplate = (
  templateId: string,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getWorkoutTemplate>>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["workout-template", templateId],
    queryFn: () => getWorkoutTemplate(templateId),
    enabled: Boolean(templateId),
    ...options,
  });
};

export const useUpdateWorkoutTemplateExerciseComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkoutTemplateExerciseComment,
    onSuccess: (updatedExercise, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workout-templates"] });
      queryClient.invalidateQueries({
        queryKey: ["workout-template", variables.templateId],
      });

      queryClient.setQueryData<WorkoutTemplate>(
        ["workout-template", variables.templateId],
        (previousTemplate) => {
          if (!previousTemplate) {
            return previousTemplate;
          }

          return {
            ...previousTemplate,
            exercises: previousTemplate.exercises.map((exercise) => {
              if (exercise.id !== variables.templateExerciseId) {
                return exercise;
              }

              return {
                ...exercise,
                comment: updatedExercise.comment,
              };
            }),
          };
        },
      );
    },
  });
};

export type { UpdateWorkoutTemplateExerciseCommentPayload };

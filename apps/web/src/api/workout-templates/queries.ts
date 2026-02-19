import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  createWorkoutTemplate,
  getWorkoutTemplate,
  getWorkoutTemplates,
  updateWorkoutTemplate,
} from "./api";
import type { UpsertWorkoutTemplatePayload } from "./types";

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
    ...options,
  });
};

export const useCreateWorkoutTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertWorkoutTemplatePayload) =>
      createWorkoutTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-templates"],
      });
    },
  });
};

export const useUpdateWorkoutTemplate = (templateId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertWorkoutTemplatePayload) =>
      updateWorkoutTemplate(templateId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-templates"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workout-template", templateId],
      });
    },
  });
};

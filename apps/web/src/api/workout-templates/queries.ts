import {
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { getWorkoutTemplate, getWorkoutTemplates } from "./api";

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

import { useMutation } from "@tanstack/react-query";

import { createWorkoutSession } from "./api";

export const useCreateWorkoutSession = () => {
  return useMutation({
    mutationFn: createWorkoutSession,
  });
};

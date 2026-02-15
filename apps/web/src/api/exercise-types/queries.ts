import { useQuery } from "@tanstack/react-query";

import { getExerciseTypes } from "./api";

export const useGetExerciseTypes = () => {
  return useQuery({
    queryKey: ["exercise-types"],
    queryFn: getExerciseTypes,
  });
};

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { WorkoutTemplateFormFormValues } from "../WorkoutTemplateForm";
import { PhaseItem } from "./PhaseItem";

interface PhasesProps {
  exerciseIndex: number;
  setIndex: number;
}

export const Phases: React.FC<PhasesProps> = (props) => {
  const { exerciseIndex, setIndex } = props;

  const { control } = useFormContext<WorkoutTemplateFormFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets.${setIndex}.phases`,
  });

  const handleAddPhase = () => {
    append({ reps: 10, weight: 10, type: "strict" });
  };

  const handleRemovePhase = (phaseIndex: number) => {
    remove(phaseIndex);
  };

  return (
    <div className="flex flex-col gap-2">
      {fields.map((phaseItem, phaseIndex) => (
        <PhaseItem
          key={phaseItem.id}
          exerciseIndex={exerciseIndex}
          setIndex={setIndex}
          phaseIndex={phaseIndex}
          onRemove={() => handleRemovePhase(phaseIndex)}
        />
      ))}

      <button
        className="cursor-pointer rounded border px-2 py-1 text-sm"
        type="button"
        onClick={handleAddPhase}
      >
        Add Phase
      </button>
    </div>
  );
};

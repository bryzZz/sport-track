import { phasesTypes } from "constants";
import React from "react";
import { useFormContext } from "react-hook-form";

import type { WorkoutTemplateFormFormValues } from "../WorkoutTemplateForm";

interface PhaseItemProps {
  exerciseIndex: number;
  setIndex: number;
  phaseIndex: number;
  onRemove: () => void;
}

export const PhaseItem: React.FC<PhaseItemProps> = (props) => {
  const { exerciseIndex, setIndex, phaseIndex, onRemove } = props;

  const { register } = useFormContext<WorkoutTemplateFormFormValues>();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className="w-20 rounded border border-zinc-600 bg-transparent px-2 py-1"
        type="number"
        min={1}
        placeholder="Reps"
        {...register(
          `exercises.${exerciseIndex}.sets.${setIndex}.phases.${phaseIndex}.reps`,
          { valueAsNumber: true },
        )}
      />

      <input
        className="w-24 rounded border border-zinc-600 bg-transparent px-2 py-1"
        type="number"
        min={0}
        step={0.5}
        placeholder="Weight"
        {...register(
          `exercises.${exerciseIndex}.sets.${setIndex}.phases.${phaseIndex}.weight`,
          { valueAsNumber: true },
        )}
      />

      <select
        className="rounded border border-zinc-600 bg-transparent px-2 py-1"
        {...register(
          `exercises.${exerciseIndex}.sets.${setIndex}.phases.${phaseIndex}.type`,
        )}
      >
        {phasesTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button
        className="cursor-pointer rounded border px-2 py-1 text-sm"
        type="button"
        onClick={onRemove}
      >
        Remove Phase
      </button>
    </div>
  );
};

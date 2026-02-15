import React from "react";

import { Phases } from "./Phases";

interface SetItemProps {
  exerciseIndex: number;
  index: number;
  onRemove: () => void;
}

export const SetItem: React.FC<SetItemProps> = (props) => {
  const { exerciseIndex, index, onRemove } = props;

  return (
    <div className="rounded border border-zinc-700 p-2">
      <div className="mb-2 flex items-center justify-between">
        <span>{index + 1}.</span>
        <button
          className="cursor-pointer rounded border px-2 py-1 text-sm"
          type="button"
          onClick={onRemove}
        >
          Remove Set
        </button>
      </div>

      <Phases exerciseIndex={exerciseIndex} setIndex={index} />
    </div>
  );
};

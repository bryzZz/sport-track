import React, { useState } from "react";

import {
  exerciseTypes,
  workoutTemplates,
  type WorkoutTemplate,
} from "../constants";

export const CreateWorkoutTemplate: React.FC = () => {
  const [name, setName] = useState(workoutTemplates[0].name);
  const [exercises, setExercises] = useState<WorkoutTemplate["exercises"]>([
    ...workoutTemplates[0].exercises,
  ]);

  const handleAddExercise = () => {
    setExercises((p) => {
      if (p[p.length - 1]?.exerciseId === "") return p;

      return [
        ...p,
        {
          exerciseId: "",
          sets: [{ phases: [{ reps: 10, weight: 10, type: "strict" }] }],
        },
      ];
    });
  };

  return (
    <div>
      <h1 className="mb-6 text-4xl">Create Workout Template</h1>

      <div className="mx-auto flex max-w-3xl flex-col items-start gap-4">
        <input
          className="w-full rounded border px-4 py-2"
          placeholder="Template Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex w-full flex-col items-start gap-2">
          {exercises.map((exercise, i) => (
            <div key={i} className="w-full rounded border border-zinc-600 p-2">
              <select value={exercise.exerciseId}>
                <option value="">Select Exercise</option>
                {exerciseTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>

              <div>
                <p>Sets: </p>

                <div>
                  {exercise.sets.map((set, i) => (
                    <div key={i}>
                      <span>{i + 1}. </span>
                      {set.phases.map((phase, j) => (
                        <span key={j}>
                          {`${phase.reps} reps of ${phase.weight}kg (${phase.type}) `}
                          {j !== set.phases.length - 1 && "and "}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div>{exercise.comment}</div>
            </div>
          ))}

          <button
            className="cursor-pointer rounded border px-6 py-2"
            type="button"
            onClick={handleAddExercise}
          >
            Add Exercise
          </button>
        </div>
      </div>
    </div>
  );
};

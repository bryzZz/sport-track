import React, { useState } from "react";
import { Link } from "react-router";

import { workoutTemplates } from "../constants";

import Fire from "../assets/icons/fire.svg?react";

export const WorkoutTemplates: React.FC = () => {
  const [items] = useState(workoutTemplates);

  return (
    <div>
      <h1 className="mb-6 text-4xl">Workout Templates</h1>

      <div className="flex flex-col items-start gap-2">
        {items.map((template) => (
          <div
            key={template.id}
            className="flex items-center justify-between gap-6 rounded-lg border px-4 py-2"
          >
            <h2 className="mb-2 text-2xl">{template.name}</h2>

            <div className="flex items-center gap-2">
              Streak 19
              <Fire className="size-4 shrink-0" />
            </div>

            <p>Next Date: {new Date().toLocaleDateString("ru-RU")}</p>

            <button
              className="cursor-pointer rounded border px-6 py-2"
              type="button"
            >
              Edit
            </button>

            <Link to="/stats">
              <button
                className="cursor-pointer rounded border px-6 py-2"
                type="button"
              >
                Stats
              </button>
            </Link>
          </div>
        ))}

        <Link to="/create">
          <button
            className="cursor-pointer rounded border px-6 py-2"
            type="button"
          >
            New Template
          </button>
        </Link>
      </div>
    </div>
  );
};

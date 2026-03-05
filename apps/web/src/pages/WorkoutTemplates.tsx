import React from "react";
import { Link } from "react-router";

import { useGetWorkoutTemplates } from "../api/workout-templates";

export const WorkoutTemplates: React.FC = () => {
  const { data: templates = [], isLoading, isError } = useGetWorkoutTemplates();
  const baseButtonClassName =
    "w-full cursor-pointer rounded border px-4 py-2 text-left sm:w-auto sm:px-6 sm:text-center";

  if (isLoading) {
    return <p>Loading templates...</p>;
  }

  if (isError) {
    return <p>Failed to load workout templates.</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl sm:text-4xl">Workout Templates</h1>

      <div className="flex flex-col gap-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex w-full flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <h2 className="text-xl wrap-break-word sm:text-2xl">
              {template.name}
            </h2>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Link
                className="w-full sm:w-auto"
                to={`/templates/edit?templateId=${encodeURIComponent(template.id)}`}
              >
                <button className={baseButtonClassName} type="button">
                  Edit
                </button>
              </Link>

              <Link
                className="w-full sm:w-auto"
                to={`/workout/perform?templateId=${template.id}`}
              >
                <button className={baseButtonClassName} type="button">
                  Perform
                </button>
              </Link>

              <Link
                className="w-full sm:w-auto"
                to={`/stats?templateId=${template.id}`}
              >
                <button className={baseButtonClassName} type="button">
                  Stats
                </button>
              </Link>
            </div>
          </div>
        ))}

        <Link className="w-full sm:w-auto" to="/templates/create">
          <button className={baseButtonClassName} type="button">
            New Template
          </button>
        </Link>
      </div>
    </div>
  );
};

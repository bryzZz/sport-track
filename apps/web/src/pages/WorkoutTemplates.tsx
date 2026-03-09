import React from "react";
import { Link } from "react-router";

import EditActionIcon from "assets/icons/action-edit.svg?react";
import PerformActionIcon from "assets/icons/action-perform.svg?react";
import StatsActionIcon from "assets/icons/action-stats.svg?react";

import { useGetWorkoutTemplates } from "../api/workout-templates";

export const WorkoutTemplates: React.FC = () => {
  const { data: templates = [], isLoading, isError } = useGetWorkoutTemplates();

  if (isLoading) {
    return <p>Loading templates...</p>;
  }

  if (isError) {
    return <p>Failed to load workout templates.</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl">Workout Templates</h1>

      <div className="flex flex-col gap-3">
        {templates.map((template) => (
          <div key={template.id} className="rounded-lg border px-4 py-3">
            <h2 className="mb-4 text-2xl wrap-break-word">{template.name}</h2>

            <div className="flex items-center justify-end gap-2">
              <Link
                className="flex items-center justify-center rounded border p-2.5 text-neutral-700"
                title="Stats"
                to={`/stats?templateId=${template.id}`}
              >
                <StatsActionIcon className="size-5" />
              </Link>

              <Link
                className="flex items-center justify-center rounded border p-2.5 text-neutral-700"
                title="Edit"
                to={`/templates/edit?templateId=${template.id}`}
              >
                <EditActionIcon className="size-5" />
              </Link>

              <Link
                className="flex items-center justify-center rounded border p-2.5 text-neutral-700"
                title="Perform"
                to={`/workout/perform?templateId=${template.id}`}
              >
                <PerformActionIcon className="size-5" />
              </Link>
            </div>
          </div>
        ))}

        <Link
          className="rounded border p-2.5 text-center"
          to="/templates/create"
        >
          New Template
        </Link>
      </div>
    </div>
  );
};

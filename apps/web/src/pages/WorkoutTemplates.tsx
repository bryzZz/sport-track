import React, { useEffect, useState } from "react";
import { Link } from "react-router";

import type { WorkoutTemplateDto } from "../api/types";
import { workoutTemplatesApi } from "../api/workoutTemplatesApi";

export const WorkoutTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<WorkoutTemplateDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleLoadTemplates = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const templatesData = await workoutTemplatesApi.getList();
        setTemplates(templatesData);
      } catch {
        setErrorMessage("Не удалось загрузить шаблоны тренировок.");
      } finally {
        setIsLoading(false);
      }
    };

    void handleLoadTemplates();
  }, []);

  if (isLoading) {
    return <p>Загрузка шаблонов...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-4xl">Workout Templates</h1>

      <div className="flex flex-col items-start gap-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex items-center justify-between gap-6 rounded-lg border px-4 py-2"
          >
            <h2 className="text-2xl">{template.name}</h2>

            <Link to={`/templates/${template.id}/edit`}>
              <button
                className="cursor-pointer rounded border px-6 py-2"
                type="button"
              >
                Edit
              </button>
            </Link>

            <Link to={`/workout/perform?templateId=${template.id}`}>
              <button
                className="cursor-pointer rounded border px-6 py-2"
                type="button"
              >
                Perform
              </button>
            </Link>

            <Link to={`/stats?templateId=${template.id}`}>
              <button
                className="cursor-pointer rounded border px-6 py-2"
                type="button"
              >
                Stats
              </button>
            </Link>
          </div>
        ))}

        <Link to="/templates/create">
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

import React from "react";
import { format, isValid, parseISO } from "date-fns";

import { workoutData } from "../constants";

const intensityClasses = [
  "bg-neutral-200/40",
  "bg-lime-400",
  "bg-lime-500",
  "bg-lime-600",
  "bg-amber-400",
  "bg-amber-500",
  "bg-amber-600",
  "bg-red-400",
  "bg-red-500",
  "bg-red-600",
];

const getIntensityClass = (intensity: number) => {
  return intensityClasses[intensity];
};

export const WorkoutHeatmapCompact: React.FC = () => {
  const normalizedData = workoutData
    .map((item) => ({ ...item, dateObj: parseISO(item.date) }))
    .filter((item) => isValid(item.dateObj))
    .map((item) => ({
      date: item.dateObj,
      dateKey: format(item.dateObj, "yyyy-MM-dd"),
      intensity: item.done ? item.intensity : 0,
      done: item.done,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (normalizedData.length === 0) {
    return <p>Нет данных для построения heatmap</p>;
  }

  const columns = 12;
  const rows = Math.ceil(normalizedData.length / columns);

  const monthLabels = new Array(columns).fill("").map((_, colIndex) => {
    const item = normalizedData[colIndex];
    if (!item) {
      return "";
    }

    if (colIndex === 0) {
      return format(item.date, "MMM");
    }

    const prev = normalizedData[colIndex - 1];
    return prev && prev.date.getMonth() !== item.date.getMonth()
      ? format(item.date, "MMM")
      : "";
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="w-8" />

        <div
          className="grid gap-1 text-xs text-neutral-500"
          style={{
            gridTemplateColumns: `repeat(${columns}, 16px)`,
          }}
        >
          {monthLabels.map((label, index) => (
            <span key={index} className="text-center">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <div
          className="grid gap-2 text-xs text-neutral-500"
          style={{ gridTemplateRows: `repeat(${rows}, 16px)` }}
        >
          {new Array(rows).fill(0).map((_, index) => (
            <span key={index} className="h-4 leading-4">
              {index + 1}
            </span>
          ))}
        </div>

        <div
          className="grid auto-rows-[16px] gap-1"
          style={{
            gridTemplateColumns: `repeat(${columns}, 16px)`,
          }}
        >
          {normalizedData.map((day) => {
            const isRestDay = !day.done;
            const label = isRestDay
              ? `${format(day.date, "dd.MM.yyyy")} — пропуск тренировки`
              : `${format(day.date, "dd.MM.yyyy")} — интенсивность ${day.intensity}`;

            return (
              <div
                key={day.dateKey}
                className={`h-4 w-4 rounded ${getIntensityClass(day.intensity)} ${
                  isRestDay
                    ? "ring-1 ring-neutral-300/60"
                    : "ring-1 ring-black/10"
                }`}
                title={label}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-neutral-500">
        <span>Меньше</span>
        <div className="flex items-center gap-1">
          {intensityClasses.map((itemClass, index) => (
            <span key={index} className={`h-3 w-3 rounded ${itemClass}`} />
          ))}
        </div>
        <span>Больше</span>
      </div>
    </div>
  );
};

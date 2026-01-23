import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { format } from "date-fns";
import { workoutData } from "../constants";

const colors = [
  "#562929",
  "#6d382c",
  "#81492d",
  "#925d2b",
  "#9e7429",
  "#a58d28",
  "#a5a72d",
  "#9ec23c",
  "#8ede54",
  "#70fa76",
];

export const WorkoutVolumeChart: React.FC = () => {
  // const average =
  //   workoutData.reduce((s, d) => s + d.volume, 0) / workoutData.length;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={workoutData}>
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(new Date(d), "dd.MM")}
        />

        <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />

        <Tooltip
          // formatter={(value: number) => <p>`${value.toLocaleString()} кг`</p>}
          labelFormatter={(label) => format(new Date(label), "dd MMM yyyy")}
        />

        <Bar dataKey="intensity" radius={[4, 4, 0, 0]}>
          {workoutData.map((entry, index) => (
            <Cell
              key={index}
              fill={
                colors[entry.intensity]
                // entry.volume >= average
                //   ? "#22c55e" // выше среднего
                //   : "#9ca3af" // ниже среднего
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

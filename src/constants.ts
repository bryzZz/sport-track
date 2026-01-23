export type WorkoutTemplate = {
  id: string;
  name: string;
  streak: number; // Потом уедет
  exercises: {
    exerciseId: string;
    sets: {
      phases: {
        reps: number;
        weight: number;
        type: "strict" | "cheating";
      }[];
    }[];
    comment?: string;
  }[];
};

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: "1",
    name: "Push A",
    streak: 19,
    exercises: [
      // Shoulder press
      {
        exerciseId: "1",
        sets: [
          { phases: [{ reps: 12, weight: 45, type: "strict" }] },
          { phases: [{ reps: 12, weight: 45, type: "strict" }] },
          { phases: [{ reps: 12, weight: 45, type: "strict" }] },
        ],
        comment: "Возможен дроп веса на последних подходах",
      },

      // Dumbbell lateral raises (strict + cheating)
      {
        exerciseId: "2",
        sets: [
          {
            phases: [
              { reps: 12, weight: 7, type: "strict" },
              { reps: 4, weight: 7, type: "cheating" },
            ],
          },
          {
            phases: [
              { reps: 12, weight: 7, type: "strict" },
              { reps: 4, weight: 7, type: "cheating" },
            ],
          },
          {
            phases: [
              { reps: 12, weight: 7, type: "strict" },
              { reps: 4, weight: 7, type: "cheating" },
            ],
          },
        ],
      },

      // Incline Dumbbell Press (heavy + backoff)
      {
        exerciseId: "3",
        sets: [
          {
            phases: [{ reps: 6, weight: 20, type: "strict" }],
          },
          {
            phases: [{ reps: 10, weight: 16, type: "strict" }],
          },
          {
            phases: [{ reps: 10, weight: 16, type: "strict" }],
          },
        ],
        comment: "3 высота с конца и 2 высота сидушки снизу",
      },

      // Machine Chest Press
      {
        exerciseId: "4",
        sets: [
          { phases: [{ reps: 10, weight: 30, type: "strict" }] },
          { phases: [{ reps: 10, weight: 30, type: "strict" }] },
          { phases: [{ reps: 10, weight: 30, type: "strict" }] },
        ],
        comment: "Попробовать правый тренажёр",
      },

      // Pec Fly
      {
        exerciseId: "5",
        sets: [
          { phases: [{ reps: 12, weight: 63, type: "strict" }] },
          { phases: [{ reps: 12, weight: 63, type: "strict" }] },
          { phases: [{ reps: 12, weight: 63, type: "strict" }] },
        ],
        comment: "2 уровень растяжения",
      },

      // Close Grip Bench Press
      {
        exerciseId: "6",
        sets: [
          { phases: [{ reps: 10, weight: 35, type: "strict" }] },
          { phases: [{ reps: 10, weight: 35, type: "strict" }] },
          { phases: [{ reps: 10, weight: 35, type: "strict" }] },
        ],
        comment: "Посмотреть технику",
      },

      // Triceps Pushdown (bar)
      {
        exerciseId: "7",
        sets: [
          { phases: [{ reps: 10, weight: 50, type: "strict" }] },
          { phases: [{ reps: 10, weight: 45, type: "strict" }] },
          { phases: [{ reps: 10, weight: 45, type: "strict" }] },
        ],
      },
    ],
  },
];

export const workoutData = [
  { date: "2026-01-02", done: true, intensity: 6 },
  { date: "2026-01-05", done: false, intensity: 0 },
  { date: "2026-01-08", done: true, intensity: 6 },
  { date: "2026-01-12", done: true, intensity: 8 },
  { date: "2026-01-15", done: true, intensity: 4 },
  { date: "2026-01-18", done: true, intensity: 7 },
  { date: "2026-01-21", done: true, intensity: 8 },
  { date: "2026-01-24", done: true, intensity: 8 },
  { date: "2026-01-27", done: false, intensity: 4 },
  { date: "2026-01-30", done: true, intensity: 4 },
  { date: "2026-02-02", done: true, intensity: 7 },
  { date: "2026-02-05", done: true, intensity: 7 },
  { date: "2026-02-08", done: true, intensity: 8 },
  { date: "2026-02-12", done: true, intensity: 8 },
  { date: "2026-02-15", done: true, intensity: 4 },
  { date: "2026-02-18", done: true, intensity: 7 },
  { date: "2026-02-21", done: true, intensity: 8 },
  { date: "2026-02-24", done: true, intensity: 8 },
  { date: "2026-02-27", done: true, intensity: 4 },
  { date: "2026-02-30", done: true, intensity: 7 },
];

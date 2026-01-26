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
        type: "strict" | "cheating" | "drop";
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

export const exerciseTypes = [
  { id: "1", name: "Shoulder press" },
  { id: "2", name: "Dumbbell lateral raises" },
  { id: "3", name: "Incline Dumbbell press" },
  { id: "4", name: "Жим в тренажере" },
  { id: "5", name: "Pec fly" },
  { id: "6", name: "Close grip bench press" },
  { id: "7", name: "Трицепс в блоке (bar)" },
  { id: "8", name: "Подтягивания широким хватом" },
  { id: "9", name: "Lat pulldown" },
  { id: "10", name: "T-bar rows" },
  { id: "11", name: "Горизонтальная тяга к груди" },
  { id: "12", name: "Cable pullovers" },
  { id: "13", name: "Подъем штанги на бицепс" },
  { id: "14", name: "Подъем гантелей на бицепс сидя в наклоне" },
  { id: "15", name: "Отжимания на брусьях" },
  { id: "16", name: "Dumbbell Shoulder press" },
  { id: "17", name: "Cable lateral raises" },
  { id: "18", name: "Smit Machine chest press" },
  { id: "19", name: "Pec fly" },
  { id: "20", name: "Scullcrusher" },
  { id: "21", name: "Barbell rows" },
  { id: "22", name: "Горизонтальная тяга к груди на каждую руку" },
  { id: "23", name: "Становая тяга" },
  { id: "24", name: "Подъем на бицепс в кроссовере (bar)" },
  { id: "25", name: "Гантели на бицепс молот" },
];

export const phasesTypes = ["strict", "cheating", "drop"] as const;

export const realWorkoutRecords = [
  {
    id: "1",
    performedAt: "2026-01-26T18:32:00+02:00",
    templateId: "1",
    rpe: 7,
    exercises: [
      {
        exerciseId: "1",
        sets: [
          { phases: [{ reps: 10, weight: 45, type: "strict" }] },
          { phases: [{ reps: 10, weight: 45, type: "strict" }] },
          {
            phases: [
              { reps: 5, weight: 45, type: "strict" },
              { reps: 5, weight: 32, type: "drop" },
            ],
          },
        ],
      },
      {
        exerciseId: "2",
        sets: [
          {
            phases: [{ reps: 12, weight: 8, type: "strict" }],
          },
          {
            phases: [{ reps: 12, weight: 8, type: "strict" }],
          },
          {
            phases: [{ reps: 12, weight: 8, type: "strict" }],
          },
        ],
      },
      {
        exerciseId: "3",
        sets: [
          {
            phases: [{ reps: 10, weight: 20, type: "strict" }],
          },
          {
            phases: [{ reps: 10, weight: 20, type: "strict" }],
          },
          {
            phases: [{ reps: 10, weight: 16, type: "strict" }],
          },
        ],
      },
      {
        exerciseId: "4",
        sets: [
          { phases: [{ reps: 10, weight: 30, type: "strict" }] },
          { phases: [{ reps: 10, weight: 40, type: "strict" }] },
          { phases: [{ reps: 9, weight: 40, type: "strict" }] },
        ],
      },
      {
        exerciseId: "5",
        sets: [
          { phases: [{ reps: 12, weight: 63, type: "strict" }] },
          { phases: [{ reps: 12, weight: 63, type: "strict" }] },
          { phases: [{ reps: 12, weight: 63, type: "strict" }] },
        ],
      },
      {
        exerciseId: "6",
        sets: [
          { phases: [{ reps: 10, weight: 35, type: "strict" }] },
          { phases: [{ reps: 7, weight: 40, type: "strict" }] },
          { phases: [{ reps: 7, weight: 40, type: "strict" }] },
        ],
      },
      {
        exerciseId: "7",
        sets: [
          { phases: [{ reps: 10, weight: 50, type: "strict" }] },
          { phases: [{ reps: 10, weight: 50, type: "strict" }] },
          { phases: [{ reps: 10, weight: 50, type: "strict" }] },
          { phases: [{ reps: 10, weight: 45, type: "strict" }] },
        ],
      },
    ],
  },
];

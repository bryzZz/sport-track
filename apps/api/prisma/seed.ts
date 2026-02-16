import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type TemplateSeed = {
  name: string;
  exercises: {
    exerciseName: string;
    comment?: string;
    sets: {
      reps: number;
      partialReps?: number;
      weight: number;
    }[];
  }[];
};

type WorkoutSessionSeed = {
  performedAt: string;
  templateName: string;
  rpe: number;
  exercises: {
    exerciseName: string;
    sets: {
      reps: number;
      partialReps?: number;
      weight: number;
      isCompleted: boolean;
    }[];
  }[];
};

const exerciseTypes = [
  "Shoulder press",
  "Dumbbell lateral raises",
  "Incline Dumbbell press",
  "Жим в тренажере",
  "Pec fly",
  "Close grip bench press",
  "Трицепс в блоке (bar)",
  "Подтягивания широким хватом",
  "Lat pulldown",
  "T-bar rows",
  "Горизонтальная тяга к груди",
  "Cable pullovers",
  "Подъем штанги на бицепс",
  "Подъем гантелей на бицепс сидя в наклоне",
  "Отжимания на брусьях",
  "Dumbbell Shoulder press",
  "Cable lateral raises",
  "Smit Machine chest press",
  "Scullcrusher",
  "Barbell rows",
  "Горизонтальная тяга к груди на каждую руку",
  "Становая тяга",
  "Подъем на бицепс в кроссовере (bar)",
  "Гантели на бицепс молот",
  "Smith Machine JM Press",
];

const workoutTemplatesSeed: TemplateSeed[] = [
  {
    name: "Push A",
    exercises: [
      {
        exerciseName: "Shoulder press",
        sets: [
          { reps: 12, weight: 45 },
          { reps: 12, weight: 45 },
          { reps: 12, weight: 45 },
        ],
      },
      {
        exerciseName: "Dumbbell lateral raises",
        sets: [
          { reps: 12, weight: 8 },
          { reps: 12, weight: 8 },
          { reps: 12, weight: 8 },
        ],
      },
      {
        exerciseName: "Incline Dumbbell press",
        comment: "3 высота с конца и 2 высота сидушки снизу",
        sets: [
          { reps: 6, weight: 20 },
          { reps: 10, weight: 16 },
          { reps: 10, weight: 16 },
        ],
      },
      {
        exerciseName: "Жим в тренажере",
        sets: [
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
        ],
      },
      {
        exerciseName: "Pec fly",
        comment: "2 уровень растяжения",
        sets: [
          { reps: 12, weight: 63 },
          { reps: 12, weight: 63 },
          { reps: 12, weight: 63 },
        ],
      },
      {
        exerciseName: "Smith Machine JM Press",
        comment: '3 высота скамейки',
        sets: [
          { reps: 12, weight: 20 },
          { reps: 12, weight: 20 },
          { reps: 12, weight: 20 },
        ],
      },
      {
        exerciseName: "Трицепс в блоке (bar)",
        sets: [
          { reps: 10, weight: 50 },
          { reps: 10, weight: 50 },
          { reps: 10, weight: 45 },
          { reps: 10, weight: 45 },
        ],
      },
    ],
  },
];

const workoutSessionsSeed: WorkoutSessionSeed[] = [
  {
    performedAt: "2026-02-02T13:32:00+02:00",
    templateName: "Push A",
    rpe: 7,
    exercises: [
      {
        exerciseName: "Shoulder press",
        sets: [
          { reps: 10, weight: 45, isCompleted: true },
          { reps: 10, weight: 45, isCompleted: true },
          { reps: 10, weight: 32, isCompleted: true },
        ],
      },
      {
        exerciseName: "Dumbbell lateral raises",
        sets: [
          { reps: 12, partialReps: 4, weight: 8, isCompleted: true },
          { reps: 12, partialReps: 4, weight: 8, isCompleted: true },
          { reps: 12, partialReps: 4, weight: 8, isCompleted: true },
        ],
      },
      {
        exerciseName: "Incline Dumbbell press",
        sets: [
          { reps: 10, weight: 20, isCompleted: true },
          { reps: 7, weight: 20, isCompleted: true },
          { reps: 10, weight: 16, isCompleted: true },
        ],
      },
      {
        exerciseName: "Жим в тренажере",
        sets: [
          { reps: 10, weight: 30, isCompleted: true },
          { reps: 7, weight: 40, isCompleted: true },
          { reps: 5, weight: 40, isCompleted: true },
        ],
      },
      {
        exerciseName: "Pec fly",
        sets: [
          { reps: 10, weight: 68, isCompleted: true },
          { reps: 10, weight: 72, isCompleted: true },
          { reps: 10, weight: 77, isCompleted: true },
        ],
      },
      {
        exerciseName: "Smith Machine JM Press",
        sets: [
          { reps: 12, weight: 20, isCompleted: true },
          { reps: 12, weight: 20, isCompleted: true },
          { reps: 12, weight: 20, isCompleted: true },
        ],
      },
      {
        exerciseName: "Трицепс в блоке (bar)",
        sets: [
          { reps: 10, weight: 50, isCompleted: true },
          { reps: 10, weight: 50, isCompleted: true },
          { reps: 10, weight: 50, isCompleted: true },
          { reps: 10, weight: 45, isCompleted: true },
        ],
      },
    ],
  },
  {
    performedAt: "2026-02-09T13:32:00+02:00",
    templateName: "Push A",
    rpe: 7,
    exercises: [
      {
        exerciseName: "Shoulder press",
        sets: [
          { reps: 12, weight: 39, isCompleted: true },
          { reps: 12, weight: 39, isCompleted: true },
          { reps: 10, weight: 39, isCompleted: true },
        ],
      },
      {
        exerciseName: "Dumbbell lateral raises",
        sets: [
          { reps: 12, weight: 7, isCompleted: true },
          { reps: 12, weight: 7, isCompleted: true },
          { reps: 12, weight: 7, isCompleted: true },
        ],
      },
      {
        exerciseName: "Incline Dumbbell press",
        sets: [
          { reps: 10, weight: 16, isCompleted: true },
          { reps: 10, weight: 16, isCompleted: true },
          { reps: 10, weight: 16, isCompleted: true },
        ],
      },
      {
        exerciseName: "Жим в тренажере",
        sets: [
          { reps: 12, weight: 30, isCompleted: true },
          { reps: 12, weight: 30, isCompleted: true },
          { reps: 12, weight: 30, isCompleted: true },
        ],
      },
      {
        exerciseName: "Pec fly",
        sets: [
          { reps: 12, weight: 68, isCompleted: true },
          { reps: 12, weight: 68, isCompleted: true },
          { reps: 12, weight: 68, isCompleted: true },
        ],
      },
      {
        exerciseName: "Smith Machine JM Press",
        sets: [
          { reps: 12, weight: 20, isCompleted: true },
          { reps: 12, weight: 20, isCompleted: true },
          { reps: 12, weight: 20, isCompleted: true },
        ],
      },
      {
        exerciseName: "Трицепс в блоке (bar)",
        sets: [
          { reps: 12, weight: 45, isCompleted: true },
          { reps: 12, weight: 45, isCompleted: true },
          { reps: 12, weight: 45, isCompleted: true },
        ],
      },
    ],
  },
];

const clearWorkoutData = async () => {
  await prisma.workoutSessionSet.deleteMany();
  await prisma.workoutSessionExercise.deleteMany();
  await prisma.workoutSession.deleteMany();
  await prisma.workoutTemplateSet.deleteMany();
  await prisma.workoutTemplateExercise.deleteMany();
  await prisma.workoutTemplate.deleteMany();
};

const seedExerciseTypes = async () => {
  const exerciseTypeIdByName = new Map<string, string>();

  for (const exerciseName of exerciseTypes) {
    const upsertedExerciseType = await prisma.exerciseType.upsert({
      where: {
        name: exerciseName,
      },
      create: {
        name: exerciseName,
      },
      update: {},
    });

    exerciseTypeIdByName.set(exerciseName, upsertedExerciseType.id);
  }

  return exerciseTypeIdByName;
};

const seedTemplates = async (exerciseTypeIdByName: Map<string, string>) => {
  const templateIdByName = new Map<string, string>();
  const templateExerciseIdByKey = new Map<string, string>();

  for (const template of workoutTemplatesSeed) {
    const createdTemplate = await prisma.workoutTemplate.create({
      data: {
        name: template.name,
      },
    });

    templateIdByName.set(template.name, createdTemplate.id);

    for (const [exerciseIndex, exercise] of template.exercises.entries()) {
      const exerciseTypeId = exerciseTypeIdByName.get(exercise.exerciseName);

      if (!exerciseTypeId) {
        continue;
      }

      const createdTemplateExercise = await prisma.workoutTemplateExercise.create({
        data: {
          templateId: createdTemplate.id,
          exerciseTypeId,
          orderIndex: exerciseIndex,
          comment: exercise.comment,
        },
      });

      templateExerciseIdByKey.set(
        `${template.name}:${exercise.exerciseName}`,
        createdTemplateExercise.id,
      );

      for (const [setIndex, set] of exercise.sets.entries()) {
        await prisma.workoutTemplateSet.create({
          data: {
            templateExerciseId: createdTemplateExercise.id,
            orderIndex: setIndex,
            reps: set.reps,
            partialReps: set.partialReps,
            weight: set.weight,
          },
        });
      }
    }
  }

  return {
    templateIdByName,
    templateExerciseIdByKey,
  };
};

const seedWorkoutSessions = async (
  exerciseTypeIdByName: Map<string, string>,
  templateIdByName: Map<string, string>,
  templateExerciseIdByKey: Map<string, string>,
) => {
  for (const workoutSession of workoutSessionsSeed) {
    const templateId = templateIdByName.get(workoutSession.templateName);

    if (!templateId) {
      continue;
    }

    const createdSession = await prisma.workoutSession.create({
      data: {
        templateId,
        performedAt: new Date(workoutSession.performedAt),
        rpe: workoutSession.rpe,
      },
    });

    for (const [exerciseIndex, exercise] of workoutSession.exercises.entries()) {
      const exerciseTypeId = exerciseTypeIdByName.get(exercise.exerciseName);
      const templateExerciseId = templateExerciseIdByKey.get(
        `${workoutSession.templateName}:${exercise.exerciseName}`,
      );

      if (!exerciseTypeId || !templateExerciseId || !exercise.sets.length) {
        continue;
      }

      const createdSessionExercise = await prisma.workoutSessionExercise.create({
        data: {
          sessionId: createdSession.id,
          exerciseTypeId,
          templateExerciseId,
          orderIndex: exerciseIndex,
        },
      });

      for (const [setIndex, set] of exercise.sets.entries()) {
        await prisma.workoutSessionSet.create({
          data: {
            sessionExerciseId: createdSessionExercise.id,
            orderIndex: setIndex,
            reps: set.reps,
            partialReps: set.partialReps,
            weight: set.weight,
            isCompleted: set.isCompleted,
          },
        });
      }
    }
  }
};

const seed = async () => {
  await clearWorkoutData();

  const exerciseTypeIdByName = await seedExerciseTypes();
  const { templateIdByName, templateExerciseIdByKey } = await seedTemplates(
    exerciseTypeIdByName,
  );

  await seedWorkoutSessions(
    exerciseTypeIdByName,
    templateIdByName,
    templateExerciseIdByKey,
  );
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

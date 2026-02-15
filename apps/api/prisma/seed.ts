import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
];

const seed = async () => {
  for (const exerciseName of exerciseTypes) {
    await prisma.exerciseType.upsert({
      where: {
        name: exerciseName,
      },
      create: {
        name: exerciseName,
      },
      update: {},
    });
  }
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

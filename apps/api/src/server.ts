import { env } from "./env";
import { buildApp } from "./app";

const start = async () => {
  const app = buildApp();

  try {
    await app.listen({
      host: "0.0.0.0",
      port: env.PORT,
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();

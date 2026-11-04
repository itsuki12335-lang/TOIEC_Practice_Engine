import { ToeicCliApp } from "./cli/ToeicCliApp.js";

export async function bootstrap(): Promise<void> {
  const app = new ToeicCliApp();
  await app.start();
}

bootstrap();

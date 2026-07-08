import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

const localDatabaseUrl =
  'postgresql://inmosignal:inmosignal@localhost:5432/inmosignal?schema=public';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  API_PORT: z.coerce.number().int().positive().default(3001),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001'),
});

export type AppEnv = Omit<z.infer<typeof envSchema>, 'DATABASE_URL'> & {
  DATABASE_URL: string;
};

function loadDotenvFromWorkspace() {
  for (const path of ['.env', '../.env', '../../.env']) {
    const resolved = resolve(process.cwd(), path);
    if (existsSync(resolved)) {
      loadDotenv({ path: resolved });
      return;
    }
  }
}

export function loadEnv(input: NodeJS.ProcessEnv = process.env): AppEnv {
  if (input === process.env) {
    loadDotenvFromWorkspace();
  }

  const env = envSchema.parse(input);
  if (!env.DATABASE_URL && env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is required in production');
  }

  return {
    ...env,
    DATABASE_URL: env.DATABASE_URL ?? localDatabaseUrl,
  };
}

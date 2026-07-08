import { Worker } from 'bullmq';
import { loadEnv } from '@repo/config';
import { QUEUES, type QueueName } from '@repo/shared';
import { processors } from './processors/index.js';

const env = loadEnv();
const redisUrl = new URL(env.REDIS_URL);
const connection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || 6379),
  password: redisUrl.password || undefined,
  maxRetriesPerRequest: null,
};

const workers = QUEUES.map(
  (queueName: QueueName) =>
    new Worker(queueName, processors[queueName], { connection }),
);

for (const worker of workers) {
  worker.on('completed', (job) =>
    console.log(`${worker.name}:${job.id} completed`),
  );
  worker.on('failed', (job, error) =>
    console.error(`${worker.name}:${job?.id} failed`, error),
  );
}

console.log(`Workers listening: ${QUEUES.join(', ')}`);

import type { Processor } from 'bullmq';
import type { QueueName } from '@repo/shared';

const noop: Processor = async (job) => ({
  jobId: job.id,
  queue: job.queueName,
  skipped: true,
});

export const processors: Record<QueueName, Processor> = {
  'scrape-plan': noop,
  'normalize-listing': noop,
  'match-listing': noop,
  'send-alert': noop,
};

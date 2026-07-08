import { z } from 'zod';

export const operationTypeSchema = z.enum(['sale', 'rent']);
export const propertyTypeSchema = z.enum([
  'flat',
  'house',
  'office',
  'land',
  'other',
]);
export const opportunityStatusSchema = z.enum([
  'new',
  'contacted',
  'qualified',
  'won',
  'lost',
]);

export const tenantSearchInputSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1),
  operation: operationTypeSchema,
  propertyType: propertyTypeSchema,
  locationLabel: z.string().min(1),
  radiusMeters: z.number().int().positive().optional(),
  minPrice: z.number().int().nonnegative().optional(),
  maxPrice: z.number().int().positive().optional(),
});

export const normalizedListingSchema = z.object({
  source: z.string(),
  externalId: z.string(),
  title: z.string(),
  url: z.string().url(),
  operation: operationTypeSchema,
  propertyType: propertyTypeSchema,
  price: z.number().int().nonnegative().optional(),
  locationLabel: z.string().optional(),
});

export const scrapePlanInputSchema = z.object({
  areaKey: z.string(),
  operation: operationTypeSchema,
  propertyType: propertyTypeSchema,
  maxPrice: z.number().int().positive().optional(),
});

export const matchResultSchema = z.object({
  tenantId: z.string().uuid(),
  listingId: z.string().uuid(),
  score: z.number().min(0).max(1),
  reasons: z.array(z.string()).default([]),
});

export const opportunityDTOSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  status: opportunityStatusSchema,
  title: z.string(),
});

export type TenantSearchInput = z.infer<typeof tenantSearchInputSchema>;
export type NormalizedListing = z.infer<typeof normalizedListingSchema>;
export type ScrapePlanInput = z.infer<typeof scrapePlanInputSchema>;
export type MatchResult = z.infer<typeof matchResultSchema>;
export type OpportunityDTO = z.infer<typeof opportunityDTOSchema>;

export const QUEUES = [
  'scrape-plan',
  'normalize-listing',
  'match-listing',
  'send-alert',
] as const;
export type QueueName = (typeof QUEUES)[number];

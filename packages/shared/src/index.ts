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
export const scrapeFrequencySchema = z.enum([
  'daily',
  'every_12_hours',
  'every_6_hours',
  'every_4_hours',
  'every_2_hours',
  'hourly',
]);
export const sellerTypeSchema = z.enum(['private', 'professional', 'unknown']);

export const tenantSearchInputSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1),
  operation: operationTypeSchema,
  propertyType: propertyTypeSchema,
  locationLabel: z.string().min(1),
  centerLat: z.number().min(-90).max(90).optional(),
  centerLng: z.number().min(-180).max(180).optional(),
  radiusMeters: z.number().int().positive().optional(),
  minPrice: z.number().int().nonnegative().optional(),
  maxPrice: z.number().int().positive().optional(),
  frequency: scrapeFrequencySchema.default('every_6_hours'),
  privateOnly: z.boolean().default(false),
  maxMonthlyResults: z.number().int().positive().optional(),
  geoAreaId: z.string().uuid().optional(),
  sourceIds: z.array(z.string().uuid()).default([]),
});

export const normalizedListingSchema = z.object({
  sourceListingId: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  operation: operationTypeSchema,
  propertyType: propertyTypeSchema,
  price: z.number().int().nonnegative().optional(),
  areaM2: z.number().int().positive().optional(),
  rooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  locationLabel: z.string().optional(),
  addressText: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  sellerType: sellerTypeSchema.default('unknown'),
});

export const scrapePlanInputSchema = z.object({
  sourceId: z.string().uuid(),
  geoCellId: z.string().uuid(),
  operation: operationTypeSchema,
  propertyType: propertyTypeSchema,
  frequency: scrapeFrequencySchema,
  scrapeDemandIds: z.array(z.string().uuid()).default([]),
  priority: z.number().int().default(0),
});

export const matchResultSchema = z.object({
  tenantId: z.string().uuid(),
  tenantSearchId: z.string().uuid(),
  normalizedListingId: z.string().uuid(),
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

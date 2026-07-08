import type { NormalizedListing } from '@repo/shared';

export type ScrapeSearchInput = {
  operation: 'sale' | 'rent';
  propertyType: 'flat' | 'house' | 'office' | 'land' | 'other';
  locationLabel: string;
  minPrice?: number;
  maxPrice?: number;
};

export type RawListingCard = {
  externalId: string;
  title: string;
  url: string;
};

export type RawListingDetail = RawListingCard & {
  price?: number;
  locationLabel?: string;
};

export type { NormalizedListing };

export interface PortalAdapter {
  source: string;
  search(input: ScrapeSearchInput): Promise<RawListingCard[]>;
  getDetail(card: RawListingCard): Promise<RawListingDetail>;
  normalize(detail: RawListingDetail): NormalizedListing;
}

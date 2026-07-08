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

export type NormalizedListing = {
  source: string;
  externalId: string;
  title: string;
  url: string;
  operation: 'sale' | 'rent';
  propertyType: 'flat' | 'house' | 'office' | 'land' | 'other';
  price?: number;
  locationLabel?: string;
};

export interface PortalAdapter {
  source: string;
  search(input: ScrapeSearchInput): Promise<RawListingCard[]>;
  getDetail(card: RawListingCard): Promise<RawListingDetail>;
  normalize(detail: RawListingDetail): NormalizedListing;
}

import type { NormalizedListing } from '@repo/shared';
import type { RawListingDetail } from '../../types.js';

export function normalize(detail: RawListingDetail): NormalizedListing {
  return {
    source: 'milanuncios',
    externalId: detail.externalId,
    title: detail.title,
    url: detail.url,
    operation: 'sale',
    propertyType: 'flat',
    price: detail.price,
    locationLabel: detail.locationLabel,
  };
}

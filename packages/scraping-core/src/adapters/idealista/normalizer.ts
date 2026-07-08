import type { AdapterNormalizedListing, RawListingDetail } from '../../types';

export function normalize(detail: RawListingDetail): AdapterNormalizedListing {
  return {
    source: 'idealista',
    externalId: detail.externalId,
    title: detail.title,
    url: detail.url,
    operation: 'sale',
    propertyType: 'flat',
    price: detail.price,
    locationLabel: detail.locationLabel,
  };
}

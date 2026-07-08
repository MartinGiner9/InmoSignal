import type { AdapterNormalizedListing, RawListingDetail } from '../../types';

export function normalize(detail: RawListingDetail): AdapterNormalizedListing {
  return {
    source: 'fotocasa',
    externalId: detail.externalId,
    title: detail.title,
    url: detail.url,
    operation: 'sale',
    propertyType: 'flat',
    price: detail.price,
    locationLabel: detail.locationLabel,
  };
}

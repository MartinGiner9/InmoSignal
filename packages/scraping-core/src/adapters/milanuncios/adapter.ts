import type { PortalAdapter, RawListingDetail } from '../../types.js';
import { normalize } from './normalizer.js';

export const milanunciosAdapter: PortalAdapter = {
  source: 'milanuncios',
  async search() {
    return [];
  },
  async getDetail(card): Promise<RawListingDetail> {
    return card;
  },
  normalize,
};

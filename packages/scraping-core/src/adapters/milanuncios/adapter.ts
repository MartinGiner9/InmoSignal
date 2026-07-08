import type { PortalAdapter, RawListingDetail } from '../../types';
import { normalize } from './normalizer';

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

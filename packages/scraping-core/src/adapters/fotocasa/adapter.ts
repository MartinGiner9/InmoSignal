import type { PortalAdapter, RawListingDetail } from '../../types.js';
import { normalize } from './normalizer.js';

export const fotocasaAdapter: PortalAdapter = {
  source: 'fotocasa',
  async search() {
    return [];
  },
  async getDetail(card): Promise<RawListingDetail> {
    return card;
  },
  normalize,
};

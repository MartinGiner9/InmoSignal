import type { PortalAdapter, RawListingDetail } from '../../types';
import { normalize } from './normalizer';

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

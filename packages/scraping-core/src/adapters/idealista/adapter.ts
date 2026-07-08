import type { PortalAdapter, RawListingDetail } from '../../types';
import { normalize } from './normalizer';

export const idealistaAdapter: PortalAdapter = {
  source: 'idealista',
  async search() {
    return [];
  },
  async getDetail(card): Promise<RawListingDetail> {
    return card;
  },
  normalize,
};

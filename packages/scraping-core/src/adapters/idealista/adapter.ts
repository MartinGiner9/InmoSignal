import type { PortalAdapter, RawListingDetail } from '../../types.js';
import { normalize } from './normalizer.js';

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

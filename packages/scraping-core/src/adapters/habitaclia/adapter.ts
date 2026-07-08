import type { PortalAdapter, RawListingDetail } from '../../types.js';
import { normalize } from './normalizer.js';

export const habitacliaAdapter: PortalAdapter = {
  source: 'habitaclia',
  async search() {
    return [];
  },
  async getDetail(card): Promise<RawListingDetail> {
    return card;
  },
  normalize,
};

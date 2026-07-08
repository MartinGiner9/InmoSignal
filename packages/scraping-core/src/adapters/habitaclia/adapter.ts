import type { PortalAdapter, RawListingDetail } from '../../types';
import { normalize } from './normalizer';

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

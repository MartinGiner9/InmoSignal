import type {
  PortalAdapter,
  RawListingCard,
  RawListingDetail,
} from '../../types';
import { normalize } from './normalizer';

const cards: RawListingCard[] = [
  {
    externalId: 'mock-1',
    title: 'Piso luminoso en zona centro',
    url: 'https://example.test/listings/mock-1',
  },
];

export const mockAdapter: PortalAdapter = {
  source: 'mock',
  async search() {
    return cards;
  },
  async getDetail(card): Promise<RawListingDetail> {
    return { ...card, price: 240000, locationLabel: 'Madrid Centro' };
  },
  normalize,
};

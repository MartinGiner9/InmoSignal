import { Injectable } from '@nestjs/common';

@Injectable()
export class ListingsService {
  status() {
    return { module: 'listings', ready: true };
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchesService {
  status() {
    return { module: 'searches', ready: true };
  }
}

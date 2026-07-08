import { Injectable } from '@nestjs/common';

@Injectable()
export class OpportunitiesService {
  status() {
    return { module: 'opportunities', ready: true };
  }
}

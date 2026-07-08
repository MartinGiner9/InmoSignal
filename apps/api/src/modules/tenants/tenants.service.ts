import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantsService {
  status() {
    return { module: 'tenants', ready: true };
  }
}

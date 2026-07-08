import { Injectable } from '@nestjs/common';

@Injectable()
export class ScrapingPlansService {
  status() {
    return { module: 'scraping-plans', ready: true };
  }
}

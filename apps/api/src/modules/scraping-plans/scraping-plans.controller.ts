import { Controller, Get } from '@nestjs/common';
import { ScrapingPlansService } from './scraping-plans.service';

@Controller('scraping-plans')
export class ScrapingPlansController {
  constructor(private readonly service: ScrapingPlansService) {}

  @Get()
  status() {
    return this.service.status();
  }
}

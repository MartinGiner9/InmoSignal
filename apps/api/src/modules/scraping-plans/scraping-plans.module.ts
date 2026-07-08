import { Module } from '@nestjs/common';
import { ScrapingPlansController } from './scraping-plans.controller';
import { ScrapingPlansService } from './scraping-plans.service';

@Module({
  controllers: [ScrapingPlansController],
  providers: [ScrapingPlansService],
})
export class ScrapingPlansModule {}

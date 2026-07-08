import { Controller, Get } from '@nestjs/common';
import { SearchesService } from './searches.service';

@Controller('searches')
export class SearchesController {
  constructor(private readonly service: SearchesService) {}

  @Get()
  status() {
    return this.service.status();
  }
}

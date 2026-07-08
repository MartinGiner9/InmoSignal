import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { SearchesModule } from './modules/searches/searches.module';
import { ListingsModule } from './modules/listings/listings.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { ScrapingPlansModule } from './modules/scraping-plans/scraping-plans.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    AuthModule,
    TenantsModule,
    UsersModule,
    SearchesModule,
    ListingsModule,
    OpportunitiesModule,
    ScrapingPlansModule,
    HealthModule,
  ],
})
export class AppModule {}

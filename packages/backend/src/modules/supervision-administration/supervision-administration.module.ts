import { Module } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { SupervisionAdministrationService } from './supervision-administration.service';
import { SupervisionAdministrationController } from './supervision-administration.controller';

@Module({
  controllers: [SupervisionAdministrationController],
  providers: [SupervisionAdministrationService, CloudBaseService],
})
export class SupervisionAdministrationModule {}

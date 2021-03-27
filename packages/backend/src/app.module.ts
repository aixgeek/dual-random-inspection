import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './global.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SupervisionAdministrationModule } from './modules/supervision-administration/supervision-administration.module';
import { IndustryTypeModule } from './modules/industry-type/industry-type.module';
import { InspectionMatterModule } from './modules/inspection-matter/inspection-matter.module';
import { MarketParticipantModule } from './modules/market-participant/market-participant.module';
import { LawEnforcementOfficialModule } from './modules/law-enforcement-official/law-enforcement-official.module';
import { DutyDepartmentModule } from './modules/duty-department/duty-department.module';
import { DoubleRandomInspectionModule } from './modules/double-random-inspection/double-random-inspection.module';
import { DoubleRandomResultModule } from './modules/double-random-result/double-random-result.module';

@Module({
  imports: [
    GlobalModule,
    AuthModule,
    UserModule,
    SupervisionAdministrationModule,
    IndustryTypeModule,
    InspectionMatterModule,
    MarketParticipantModule,
    LawEnforcementOfficialModule,
    DutyDepartmentModule,
    DoubleRandomInspectionModule,
    DoubleRandomResultModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.local' : '.env',
    }),
  ],
})
export class AppModule {}

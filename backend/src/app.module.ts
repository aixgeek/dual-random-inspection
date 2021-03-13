/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:44:23
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 17:18:32
 * @FilePath: \VSCProjects\wanning-backend\src\app.module.ts
 */
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './global.module';
import { BodyConverter } from '@/middlewares/converter.middleware'
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { InspectionMatterModule } from './modules/inspectionMatter/inspectionMatter.module';
import { LawEnforcementOfficialModule } from './modules/lawEnforcementOfficial/lawEnforcementOfficial.module';
import { MarketParticipantModule } from './modules/marketParticipant/marketParticipant.module';
import { SupervisionAdministrationModule } from './modules/supervisionAdministration/supervisionAdministration.module';
import { IndustryTypeModule } from './modules/industryType/industryType.module';
import { DutyDepartmentModule } from './modules/dutyDepartment/dutyDepartment.module';
import { DoubleRandomInspectionModule } from './modules/doubleRandomInspection/doubleRandomInspection.module';
import { DoubleRandomResultModule } from './modules/doubleRandomResult/doubleRandomResult.module';


@Module({
  imports: [
    GlobalModule,
    AuthModule,
    UserModule,
    InspectionMatterModule,
    LawEnforcementOfficialModule,
    MarketParticipantModule,
    SupervisionAdministrationModule,
    IndustryTypeModule,
    DutyDepartmentModule,
    DoubleRandomInspectionModule,
    DoubleRandomResultModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.local' : '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BodyConverter).forRoutes('*')
  }
}

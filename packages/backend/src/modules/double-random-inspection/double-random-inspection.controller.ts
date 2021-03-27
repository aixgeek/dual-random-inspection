import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MarketParticipantService } from '@/modules/market-participant/market-participant.service';
import { LawEnforcementOfficialService } from '@/modules/law-enforcement-official/law-enforcement-official.service';
import { DoubleRandomInspectionService } from './double-random-inspection.service';
import { CreateDoubleRandomInspectionDto } from './dto/create-double-random-inspection.dto';
import { UpdateDoubleRandomInspectionDto } from './dto/update-double-random-inspection.dto';

@Controller('doubleRandomInspection')
export class DoubleRandomInspectionController {
  constructor(
    private readonly doubleRandomInspectionService: DoubleRandomInspectionService,
    private readonly marketParticipantService: MarketParticipantService,
    private readonly lawEnforcementOfficialService: LawEnforcementOfficialService,
  ) {}

  @Post('normal')
  async create(
    @Body() createDoubleRandomInspectionDto: CreateDoubleRandomInspectionDto,
    @Request() req: AuthRequest,
  ) {
    const {
      supervisionAdministrations,
      industryTypes,
      personCount,
      groupCount,
      dutyDepartments,
      inspectedRate,
    } = createDoubleRandomInspectionDto;

    const total = await this.marketParticipantService.getInspectedMPCount(
      inspectedRate,
      supervisionAdministrations.map((item) => item.name),
      industryTypes.map((item) => item.name),
    );

    const marketParticipants = await this.marketParticipantService.findRandom(
      supervisionAdministrations.map((item) => item.name),
      industryTypes.map((item) => item.name),
      total,
    );

    const lawEnforcementOfficials = await this.lawEnforcementOfficialService.findRandom(
      supervisionAdministrations.map((item) => item.name).shift(),
      dutyDepartments.map((item) => item.name),
      personCount,
      groupCount,
    );

    createDoubleRandomInspectionDto.inspectionAmount = total;
    createDoubleRandomInspectionDto.type = 'normal';

    return this.doubleRandomInspectionService.create(
      createDoubleRandomInspectionDto,
      marketParticipants,
      lawEnforcementOfficials,
    );
  }

  @Post('cooperation')
  async createCooperation(
    @Body() createDoubleRandomInspectionDto: CreateDoubleRandomInspectionDto,
    @Request() req: AuthRequest,
  ) {
    const {
      supervisionAdministrations,
      industryTypes,
      personCount,
      groupCount,
      inspectedRate,
    } = createDoubleRandomInspectionDto;

    const total = await this.marketParticipantService.getInspectedMPCount(
      inspectedRate,
      supervisionAdministrations.map((item) => item.name),
      industryTypes.map((item) => item.name),
    );

    const marketParticipants = await this.marketParticipantService.findRandom(
      supervisionAdministrations.map((item) => item.name),
      industryTypes.map((item) => item.name),
      total,
    );
    const lawEnforcementOfficials = await this.lawEnforcementOfficialService.findRandomByCooperation(
      supervisionAdministrations.map((item) => item.name),
      personCount,
      groupCount,
    );

    createDoubleRandomInspectionDto.inspectionAmount = total;
    createDoubleRandomInspectionDto.type = 'cooperation';

    return this.doubleRandomInspectionService.create(
      createDoubleRandomInspectionDto,
      marketParticipants,
      lawEnforcementOfficials,
    );
  }

  @Get(':type')
  find(
    @Param('type') type: string,
    @Request() req: AuthRequest,
    @Query() query: { current?: number; pageSize?: number } = {},
  ) {
    const { current = 1, pageSize = 10 } = query;
    const supervisionAdministrations = req.user.supervisionAdministrations;
    return this.doubleRandomInspectionService.find(
      type,
      supervisionAdministrations,
      current,
      pageSize,
    );
  }

  @Get()
  findAll() {
    return this.doubleRandomInspectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doubleRandomInspectionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoubleRandomInspectionDto: UpdateDoubleRandomInspectionDto,
  ) {
    return this.doubleRandomInspectionService.update(
      +id,
      updateDoubleRandomInspectionDto,
    );
  }

  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.doubleRandomInspectionService.removeOne(id);
  }
}

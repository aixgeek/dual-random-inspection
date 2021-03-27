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
import { LawEnforcementOfficialService } from './law-enforcement-official.service';
import { CreateLawEnforcementOfficialDto } from './dto/create-law-enforcement-official.dto';
import { UpdateLawEnforcementOfficialDto } from './dto/update-law-enforcement-official.dto';

@Controller('lawEnforcementOfficial')
export class LawEnforcementOfficialController {
  constructor(
    private readonly lawEnforcementOfficialService: LawEnforcementOfficialService,
  ) { }

  @Post()
  create(
    @Body() createLawEnforcementOfficialDto: CreateLawEnforcementOfficialDto,
  ) {
    return this.lawEnforcementOfficialService.create(
      createLawEnforcementOfficialDto,
    );
  }

  @Get()
  find(
    @Request() req: AuthRequest,
    @Query() query: { current?: number; pageSize?: number } = {},
  ) {
    const { current = 1, pageSize = 10 } = query;
    const supervisionAdministrations = req.user.supervisionAdministrations;
    return this.lawEnforcementOfficialService.find(
      supervisionAdministrations,
      current,
      pageSize,
    );
  }

  @Get('all')
  findAll(@Query() query: { supervisionAdministrations?: string[] }) {
    const { supervisionAdministrations = ['*'] } = query;
    return this.lawEnforcementOfficialService.findAll(
      [].concat(supervisionAdministrations),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lawEnforcementOfficialService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLawEnforcementOfficialDto: UpdateLawEnforcementOfficialDto,
  ) {
    return this.lawEnforcementOfficialService.update(
      +id,
      updateLawEnforcementOfficialDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lawEnforcementOfficialService.remove(+id);
  }
}

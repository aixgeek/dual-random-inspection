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
import { IndustryTypeService } from './industry-type.service';
import { CreateIndustryTypeDto } from './dto/create-industry-type.dto';
import { UpdateIndustryTypeDto } from './dto/update-industry-type.dto';

@Controller('industryType')
export class IndustryTypeController {
  constructor(private readonly industryTypeService: IndustryTypeService) { }

  @Post()
  create(@Body() createIndustryTypeDto: CreateIndustryTypeDto) {
    return this.industryTypeService.create(createIndustryTypeDto);
  }

  @Get()
  async find(
    @Request() req: AuthRequest,
    @Query() query: { current?: number; pageSize?: number } = {},
  ) {
    const { current = 1, pageSize = 10 } = query;
    const supervisionAdministrations = req.user.supervisionAdministrations;
    const { data, total } = await this.industryTypeService.find(
      supervisionAdministrations,
      current,
      pageSize,
    );
    return {
      data,
      total,
      pageSize,
      current,
      statusCode: 200,
    };
  }

  @Get('all/:type')
  findAll(
    @Request() req: AuthRequest,
    @Param('type') type: string,
    @Query() query: { supervisionAdministrations?: string | string[] }
  ) {
    if (type === 'normal') {
      const supervisionAdministrations = req.user.supervisionAdministrations;
      return this.industryTypeService.findAll(supervisionAdministrations);
    } else {
      const { supervisionAdministrations = ['*'] } = query;
      return this.industryTypeService.findAll([].concat(supervisionAdministrations));
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.industryTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIndustryTypeDto: UpdateIndustryTypeDto,
  ) {
    return this.industryTypeService.update(+id, updateIndustryTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.industryTypeService.remove(+id);
  }
}

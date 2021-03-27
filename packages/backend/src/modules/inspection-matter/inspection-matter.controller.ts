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
import { InspectionMatterService } from './inspection-matter.service';
import { CreateInspectionMatterDto } from './dto/create-inspection-matter.dto';
import { UpdateInspectionMatterDto } from './dto/update-inspection-matter.dto';

@Controller('inspectionMatter')
export class InspectionMatterController {
  constructor(
    private readonly inspectionMatterService: InspectionMatterService,
  ) { }

  @Post()
  create(@Body() createInspectionMatterDto: CreateInspectionMatterDto) {
    return this.inspectionMatterService.create(createInspectionMatterDto);
  }

  @Get(':type')
  find(
    @Param('type') type: string,
    @Request() req: AuthRequest,
    @Query() query: { current?: number; pageSize?: number } = {},
  ) {
    const { current = 1, pageSize = 10 } = query;
    if (type === 'normal') {
      const supervisionAdministrations = req.user.supervisionAdministrations;
      return this.inspectionMatterService.find(
        [].concat(supervisionAdministrations),
        current,
        pageSize
      );
    } else {
      return this.inspectionMatterService.find(
        ['*'],
        current,
        pageSize
      )
    }
  }

  @Get('all/:type')
  findAll(
    @Param('type') type: string,
    @Request() req: AuthRequest,
    @Query() query: { supervisionAdministrations?: string[] }
  ) {
    if (type === 'normal') {
      const supervisionAdministrations = req.user.supervisionAdministrations;
      return this.inspectionMatterService.findAll(
        [].concat(supervisionAdministrations),
      );
    } else {
      const { supervisionAdministrations = ['*'] } = query;
      return this.inspectionMatterService.findAll(
        [].concat(supervisionAdministrations),
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspectionMatterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInspectionMatterDto: UpdateInspectionMatterDto,
  ) {
    return this.inspectionMatterService.update(+id, updateInspectionMatterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inspectionMatterService.remove(+id);
  }
}

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
import { DutyDepartmentService } from './duty-department.service';
import { CreateDutyDepartmentDto } from './dto/create-duty-department.dto';
import { UpdateDutyDepartmentDto } from './dto/update-duty-department.dto';

@Controller('dutyDepartment')
export class DutyDepartmentController {
  constructor(private readonly dutyDepartmentService: DutyDepartmentService) { }

  @Post()
  create(@Body() createDutyDepartmentDto: CreateDutyDepartmentDto) {
    return this.dutyDepartmentService.create(createDutyDepartmentDto);
  }

  @Get('all/:type')
  findAll(
    @Request() req: AuthRequest,
    @Param('type') type: string,
    @Query() query: { supervisionAdministrations?: string | string[] }) {
    if (type === 'normal') {
      const supervisionAdministrations = req.user.supervisionAdministrations;
      return this.dutyDepartmentService.findAll(supervisionAdministrations);
    } else {
      const { supervisionAdministrations = ['*'] } = query;
      return this.dutyDepartmentService.findAll([].concat(supervisionAdministrations),);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dutyDepartmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDutyDepartmentDto: UpdateDutyDepartmentDto,
  ) {
    return this.dutyDepartmentService.update(+id, updateDutyDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dutyDepartmentService.remove(+id);
  }
}

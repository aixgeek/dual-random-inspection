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
import { Public } from '@/modules/auth/auth.decorator';
import { DoubleRandomResultService } from './double-random-result.service';
import { CreateDoubleRandomResultDto } from './dto/create-double-random-result.dto';
import { UpdateDoubleRandomResultDto } from './dto/update-double-random-result.dto';

@Controller('doubleRandomResult')
export class DoubleRandomResultController {
  constructor(
    private readonly doubleRandomResultService: DoubleRandomResultService,
  ) {}

  @Post()
  create(@Body() createDoubleRandomResultDto: CreateDoubleRandomResultDto) {
    return this.doubleRandomResultService.create(createDoubleRandomResultDto);
  }

  @Public()
  @Get('open')
  findAllByOpen(@Query() query: { current?: number; pageSize?: number } = {}) {
    const { current = 1, pageSize = 10 } = query;
    return this.doubleRandomResultService.find(current, pageSize);
  }

  @Get(':doubleRandomId')
  findAllByDRI(
    @Param('doubleRandomId') doubleRandomId: string,
    @Query() query: { current?: number; pageSize?: number } = {},
  ) {
    const { current = 1, pageSize = 10 } = query;
    return this.doubleRandomResultService.findByDRI(
      doubleRandomId,
      current,
      pageSize,
    );
  }

  @Get()
  findAll() {
    return this.doubleRandomResultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doubleRandomResultService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoubleRandomResultDto: UpdateDoubleRandomResultDto,
  ) {
    return this.doubleRandomResultService.update(
      id,
      updateDoubleRandomResultDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doubleRandomResultService.remove(+id);
  }

  @Post('export')
  exportByDRI(@Body() body: { doubleRandomIds: string[] }) {
    const { doubleRandomIds = [] } = body;
    return this.doubleRandomResultService.exportByDRI(doubleRandomIds);
  }
}

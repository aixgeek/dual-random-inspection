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
import { SupervisionAdministrationService } from './supervision-administration.service';
import { CreateSupervisionAdministrationDto } from './dto/create-supervision-administration.dto';
import { UpdateSupervisionAdministrationDto } from './dto/update-supervision-administration.dto';

@Controller('supervisionAdministration')
export class SupervisionAdministrationController {
  constructor(
    private readonly supervisionAdministrationService: SupervisionAdministrationService,
  ) { }

  @Post()
  create(
    @Body()
    createSupervisionAdministrationDto: CreateSupervisionAdministrationDto,
  ) {
    return this.supervisionAdministrationService.create(
      createSupervisionAdministrationDto,
    );
  }

  @Get('all/:type')
  findAll(
    @Request() req: AuthRequest,
    @Param('type') type: string,
    @Query() query: { supervisionAdministrations?: string[] }
  ) {
    if (type === 'normal') {
      const supervisionAdministrations = req.user.supervisionAdministrations;
      return this.supervisionAdministrationService.findAll(supervisionAdministrations);
    } else {
      const { supervisionAdministrations = ['*'] } = query;
      return this.supervisionAdministrationService.findAll([].concat(supervisionAdministrations));
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supervisionAdministrationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateSupervisionAdministrationDto: UpdateSupervisionAdministrationDto,
  ) {
    return this.supervisionAdministrationService.update(
      +id,
      updateSupervisionAdministrationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supervisionAdministrationService.remove(+id);
  }
}

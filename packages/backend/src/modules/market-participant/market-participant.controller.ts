import { omit } from 'lodash';
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
import { MarketParticipantService } from './market-participant.service';
import { CreateMarketParticipantDto } from './dto/create-market-participant.dto';
import { UpdateMarketParticipantDto } from './dto/update-market-participant.dto';

@Controller('marketParticipant')
export class MarketParticipantController {
  constructor(
    private readonly marketParticipantService: MarketParticipantService,
  ) { }

  @Post()
  async create(
    @Request() req: AuthRequest,
    @Body() createMarketParticipantDto: CreateMarketParticipantDto,
  ) {
    const { id } = await this.marketParticipantService.createOne(createMarketParticipantDto);

    return {
      data: id,
      statusCode: 201,
    };
  }

  @Get(':type')
  async find(
    @Request() req: AuthRequest,
    @Param('type') type: string,
    @Query() query: Record<string, any> & { current?: number, pageSize?: number } = {},
  ) {
    const { current = 1, pageSize = 10 } = query;
    if (type === 'normal') {
      const search = omit(query, ['current', 'pageSize'])
      const supervisionAdministrations = req.user.supervisionAdministrations;
      const { data, total } = await this.marketParticipantService.find(
        supervisionAdministrations,
        current,
        pageSize,
        search
      );

      return {
        data,
        total,
        pageSize,
        current,
        statusCode: 200,
      }
    } else {
      const { supervisionAdministrations = ['*'] } = query;
      return this.marketParticipantService.findAll([].concat(supervisionAdministrations));
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketParticipantService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMarketParticipantDto: UpdateMarketParticipantDto,
  ) {
    return this.marketParticipantService.update(
      id,
      updateMarketParticipantDto,
    );
  }

  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.marketParticipantService.removeOne(id);
  }

  @Delete()
  remove(@Body() body: { ids: string[] }) {
    const { ids = [] } = body;
    return this.marketParticipantService.remove(ids);
  }
}

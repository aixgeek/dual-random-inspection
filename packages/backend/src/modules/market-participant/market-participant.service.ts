import { omit } from 'lodash'
import { Injectable } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { Collection } from '@/constants';
import { CreateMarketParticipantDto } from './dto/create-market-participant.dto';
import { UpdateMarketParticipantDto } from './dto/update-market-participant.dto';

@Injectable()
export class MarketParticipantService {
  constructor(private readonly cloudbaseService: CloudBaseService) { }

  async create(
    createMarketParticipantDtos: CreateMarketParticipantDto[],
  ) {
    const { ids } = await this.cloudbaseService.db
      .collection(Collection.MarketParticipantsV2)
      .add(createMarketParticipantDtos);

    return { ids };
  }

  async createOne(createMarketParticipantDto: CreateMarketParticipantDto) {
    createMarketParticipantDto._updateTime = new Date().toLocaleDateString()
    createMarketParticipantDto._createTime = new Date().toLocaleDateString()
    const { id } = await this.cloudbaseService.db
      .collection(Collection.MarketParticipantsV2)
      .add(createMarketParticipantDto);

    return { id };
  }

  async findRandom(
    supervisionAdministrations: string[],
    industryTypes: string[],
    total: number,
  ) {
    const filter: any = {};
    const $ = this.cloudbaseService.db.command;
    filter.supervisionAdministration = $.in(supervisionAdministrations);
    filter.industryTypes = $.in(industryTypes);
    filter.flag = $.neq(0)

    const { data } = await this.cloudbaseService.db
      .collection(Collection.MarketParticipantsV2)
      .aggregate()
      .match({
        supervisionAdministration: filter.supervisionAdministration,
        industryTypes: filter.industryTypes,
        flag: filter.flag,
      })
      .sample({
        size: total,
      })
      .limit(total)
      .end();
    return data;
  }

  async find(
    supervisionAdministrations: string[],
    current: number,
    pageSize: number,
    search?: Record<string, any>
  ) {

    let filter = {}
    const $ = this.cloudbaseService.db.command
    if (!supervisionAdministrations?.some((_) => _ === '*')) {
      filter = {
        ...filter,
        ...this.cloudbaseService.handleSearch(search),
        supervisionAdministration: $.in(supervisionAdministrations)
      }
    } else {
      filter = {
        ...filter,
        ...this.cloudbaseService.handleSearch(search),
      }
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.MarketParticipantsV2)
      .where(filter)
      .orderBy('_updateTime', 'desc')
      .skip(Number(current - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.MarketParticipantsV2)
      .where(filter)
      .count();

    return {
      data,
      total,
    }
  }

  async findAll(supervisionAdministrations?: string[]) {
    let filter = {};
    const $ = this.cloudbaseService.db.command;
    if (!supervisionAdministrations?.some((_) => _ === '*')) {
      filter = { ...filter, supervisionAdministration: $.in(supervisionAdministrations) }
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.MarketParticipantsV2)
      .where(filter)
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.MarketParticipantsV2)
      .where(filter)
      .count();

    return {
      data,
      total,
      statusCode: 200,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} marketParticipant`;
  }

  async update(id: string, updateMarketParticipantDto: UpdateMarketParticipantDto) {
    updateMarketParticipantDto._updateTime = new Date().toLocaleDateString()
    updateMarketParticipantDto._createTime = new Date().toLocaleDateString()
    const { updated, upserted } = await this.cloudbaseService.db
      .collection(Collection.MarketParticipantsV2)
      .doc(id)
      .update(omit(updateMarketParticipantDto, ['_id']));
    return { updated, upserted };
  }

  async removeOne(id: string) {
    const { deleted } = await this.cloudbaseService.db
      .collection(Collection.MarketParticipantsV2)
      .doc(id)
      .remove();
    return { deleted };
  }

  async remove(ids: string[]) {
    const $ = this.cloudbaseService.db.command;
    let filter: any = {};
    filter = { ...filter, _id: $.in(ids) };
    const { deleted } = await this.cloudbaseService.db
      .collection(Collection.MarketParticipantsV2)
      .where(filter)
      .remove();
    return { deleted };
  }

  async getInspectedMPCount(
    inspectedRate: number,
    supervisionAdministrations: string[],
    industryTypes: string[],
  ) {
    const $ = this.cloudbaseService.db.command;
    const filter: any = {};
    filter.supervisionAdministration = $.in(supervisionAdministrations);
    filter.industryTypes = $.in(industryTypes);

    let { total } = await this.cloudbaseService
      .collection(Collection.MarketParticipantsV2)
      .where(filter)
      .count();
    if (total <= 0) {
      total = 0;
    } else if (total * (inspectedRate / 100) < 1) {
      total = 1;
    } else {
      total = ~~(total * (inspectedRate / 100));
    }

    return total;
  }

  async migrate(current: number) {

    const transaction = await this.cloudbaseService.db.startTransaction()

    const MAX_LIMIT = 1000
    const { data } = await transaction
      .collection(Collection.MarketParticipantsV2)
      .skip(Number(current - 1) * Number(MAX_LIMIT))
      .limit(MAX_LIMIT)
      .get();

    const marketParticipants: CreateMarketParticipantDto[] = new Array()
    data.map(async item => {
      const marketParticipant: CreateMarketParticipantDto = {
        name: item.name,
        address: item.address,
        contact: item.contact,
        legalRepresentative: item.legalRepresentative,
        desc: item.desc,
        usci: item.usci,
        flag: 1,
        industryTypes: [].concat(item.industryType),
        supervisionAdministration: item.supervisionAdministration,
        _updateTime: new Date().toLocaleDateString(),
        _createTime: new Date().toLocaleDateString(),
      }
      marketParticipants.push(marketParticipant)
    })

    const { ids } = await transaction
      .collection(Collection.MarketParticipantsV2)
      .add(marketParticipants);

    transaction.commit()

    return { ids }
  }
}

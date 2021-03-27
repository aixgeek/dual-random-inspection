import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { MarketParticipantService } from './market-participant.service';
import { CreateMarketParticipantDto } from './dto/create-market-participant.dto';

describe('MarketParticipantService', () => {
  let service: MarketParticipantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketParticipantService, CloudBaseService],
    }).compile();

    service = module.get<MarketParticipantService>(MarketParticipantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('删除市场主体', async () => {
    const createMarketParticipantDto: CreateMarketParticipantDto = {
      usci: 'test', // 统一信用代码
      name: 'test', // 名称
      legalRepresentative: 'test', // 法人代表
      address: 'test', // 经营地址
      contact: 'test', // 联系方式
      desc: 'test', // 备注
      flag: 1, // 状态标识 FlagEnums
      supervisionAdministration: '万宁市市场监督管理局',
      industryTypes: ['test'],
      _updateTime: new Date().getDate().toLocaleString(),
      _createTime: new Date().getDate().toLocaleString(),
    };
    const { id } = await service.createOne(createMarketParticipantDto);
    expect(id).not.toBeNaN();
    const { deleted: deletedOne } = await service.removeOne(id);
    expect(deletedOne).toEqual(1);
  });

  test('新增市场主体', async () => {
    const createMarketParticipantDto: CreateMarketParticipantDto = {
      usci: 'test', // 统一信用代码
      name: 'test', // 名称
      legalRepresentative: 'test', // 法人代表
      address: 'test', // 经营地址
      contact: 'test', // 联系方式
      desc: 'test', // 备注
      flag: 1, // 状态标识 FlagEnums
      industryTypes: ['test1', 'test2'],
      supervisionAdministration: '万宁市水务局',
      _updateTime: new Date().getDate().toLocaleString(),
      _createTime: new Date().getDate().toLocaleString(),
    };
    const { id } = await service.createOne(createMarketParticipantDto);
    expect(id).not.toBeNaN();
  });
});

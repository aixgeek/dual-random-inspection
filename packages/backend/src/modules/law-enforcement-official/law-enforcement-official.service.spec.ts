import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { LawEnforcementOfficialService } from './law-enforcement-official.service';

describe('LawEnforcementOfficialService', () => {
  let service: LawEnforcementOfficialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LawEnforcementOfficialService, CloudBaseService],
    }).compile();

    service = module.get<LawEnforcementOfficialService>(
      LawEnforcementOfficialService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('联合抽查随机抽选执法人员，平均分组', async () => {
    const supervisionAdministrations = [
      '万宁市劳动保障和安全生产执法大队',
      '万宁市交通运输执法大队',
    ];
    const personCount = 4;
    const groupCount = 3;
    const result = await service.findRandomByCooperation(
      supervisionAdministrations,
      personCount,
      groupCount,
    );
    expect(result.length).toEqual(3);
    expect(result.shift().length).toEqual(4);
  });

  test('一般抽查随机抽选执法人员，平均分组', async () => {
    const supervisionAdministration = '万宁市旅游文化市场行政执法大队';
    const dutyDepartments = ['万宁市旅游文化市场行政执法大队'];
    const personCount = 2;
    const groupCount = 3;
    const result = await service.findRandom(
      supervisionAdministration,
      dutyDepartments,
      personCount,
      groupCount,
    );
    expect(result.length).toEqual(3);
    expect(result.shift().length).toEqual(2);
  });
});

export class CreateMarketParticipantDto {
  usci: string; // 统一信用代码
  name: string; // 名称
  legalRepresentative: string; // 法人代表
  address: string; // 经营地址
  contact: string; // 联系方式
  desc: string; // 备注
  flag: number; // 状态标识 FlagEnums
  supervisionAdministration: string; // 监管单位
  industryTypes: string[]; // 行业类型
  _updateTime: string;
  _createTime: string;
}

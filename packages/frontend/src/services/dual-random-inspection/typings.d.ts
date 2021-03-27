// @ts-ignore
/* eslint-disable */

declare namespace API {

  type DoubleRandomInspection = {
    _id: string
    industryTypes: { _id: string, name: string }[]
    dutyDepartments?: { _id: string, name: string }[]
    supervisionAdministrations: { _id: string, name: string }[]
    inspectionMatters: { _id: string, name: string }[]
    inspectedRate: number
    inspectionAmount?: number
    personCount: number
    groupCount: number
    createdAt: string
    inspectedAt: string
  }



  type DualRandomResult = {
    _id: string
  }

  type MarketParticipant = {
    _id: string; // 唯一ID
    usci: string; // 统一信用代码
    name: string; // 名称
    legalRepresentative: string; // 法人代表
    address: string; // 经营地址
    contact: string; // 联系方式
    desc: string; // 备注
    flag: number; // 状态标识 FlagEnums
    industryTypes: string[]; // 行业类型
    supervisionAdministration: string; // 监管单位
  }

  type DutyDepartment = {

  }

  type SupervisionAdministration = {

  }

  type LawEnforcementOfficial = {
    _id: string,
  }

  type InspectionMatter = {
    _id: string
  }

}

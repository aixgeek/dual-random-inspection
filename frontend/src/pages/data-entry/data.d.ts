/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:47:31
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 00:11:39
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\data-entry\data.d.ts
 */
export interface IMListItem {
  _id: string;
  name: string;
  content: string;
  legalBasis: string;
  supervisionAdministration: string;
  object: string;
  method: string;
  proportion: string;
  frequency: string;
  desc: string;
}

export interface LEOListItem {
  _id: string;
  idNumber: string;
  name: string;
  sex: string;
  certificateInfo: string;
  certificateId: string;
  supervisionAdministration: string;
  dutyDepartment: string;
  budgetedPost: string;
  desc: string;
}

export interface MPListItem {
  _id: string;
  usci: string;
  name: string;
  legalRepresentative: string;
  address: string;
  contact: string;
  industryType: string;
  supervisionAdministration: string;
  dutyDepartment: string;
  flag: string;
  desc: string;
}

export interface ListParams {
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

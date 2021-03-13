/*
 * @Author: June Lue
 * @Date: 2020-09-17 13:57:15
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 15:46:50
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\system\data.d.ts
 */
export interface SupervisionAdministrationListItem {
  _id: string;
  name: string;
  password: string;
  dutyDepartment: [];
  industryType: [];
  contractPerson: string;
  contractPhone: string;
  desc: string;
}

export interface IndustryTypeListItem {
  key: number;
  name: string;
  supervisionAdministration: string;
  dutyDepartment: string;
  amount: string;
  desc: string;
}

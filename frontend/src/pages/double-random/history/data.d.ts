/*
 * @Author: June Lue
 * @Date: 2020-09-17 13:57:15
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 18:04:55
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\double-random\history\data.d.ts
 */
export interface ListItem {
  _id: string;
  inspectionMatter: string[];
  inspectionAmount: number;
  industryType: string;
  supervisionAdminitration: string;
  dutyDepartment: string;
  createdAt: Date;
  inspectedAt: Date;
  desc: string;
  result: ResultListItem[];
}

export interface ResultListItem {
  _id: string;
  marketParticipant: string;
  lawEnforcementOfficials: number;
  inspectionMatter: string;
  inspection_date: Date;
  status: number;
  inspectedAt: Date;
  desc: string;
}

export interface ListParams {
  key?: string;
  inspection_subject_matter?: string;
  inspection_date?: Date;
  inspectedAt?: Date;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

export interface ResultListParams {
  result_key?: string;
  market_participant?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

export interface ListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ListData {
  list: ListItem[];
  pagination: Partial<TableListPagination>;
}

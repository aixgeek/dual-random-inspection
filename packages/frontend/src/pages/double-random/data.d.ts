export interface DoubleRandomInspection {
  _id: string
  industryTypes: { _id: string, name: string }[]
  dutyDepartments: { _id: string, name: string }[]
  supervisionAdministrations: { _id: string, name: string }[]
  inspectionMatters: { _id: string, name: string }[]
  inspectedRate: number
  inspectionAmount: number
  personCount: number
  groupCount: number
  createdAt: string
  inspectedAt: string
  type: string
}

export interface DoubleRandomResult {
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

export class DoubleRandomInspection {
  _id: string;
  industryTypes: { _id: string; name: string }[];
  dutyDepartments: { _id: string; name: string }[];
  inspectionMatters: { _id: string; name: string }[];
  supervisionAdministrations: string[];
  inspectedRate: number;
  inspectionAmount: number;
  personCount: number;
  groupCount: number;
  createdAt: string;
  inspectedAt: string;
}

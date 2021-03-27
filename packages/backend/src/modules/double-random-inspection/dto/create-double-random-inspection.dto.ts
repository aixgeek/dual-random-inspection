export class CreateDoubleRandomInspectionDto {
  _id?: string;
  industryTypes: { _id: string; name: string }[];
  dutyDepartments: { _id: string; name: string }[];
  supervisionAdministrations: { _id: string; name: string }[];
  inspectionMatters: { _id: string; name: string }[];
  inspectedRate: number;
  inspectionAmount: number;
  personCount: number;
  groupCount: number;
  createdAt: string;
  inspectedAt: string;
  type: string;
}

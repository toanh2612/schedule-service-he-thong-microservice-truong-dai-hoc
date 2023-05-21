export interface IGetMasterConfigListFilter {
  id: string | null | undefined;
  key: string;
  value: string;
  type: string;
  description: string;
  isDeleted: boolean;
}

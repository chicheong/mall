import { IOffice } from 'app/shared/model/office.model';
import { ICompany } from 'app/shared/model/company.model';
import { CommonStatus } from 'app/shared/model/enumerations/common-status.model';

export interface IDepartment {
  id?: number;
  code?: string;
  name?: string;
  status?: CommonStatus;
  parent?: IDepartment;
  offices?: IOffice[];
  companies?: ICompany[];
}

export class Department implements IDepartment {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public status?: CommonStatus,
    public parent?: IDepartment,
    public offices?: IOffice[],
    public companies?: ICompany[]
  ) {}
}

import { IDepartment } from 'app/shared/model/department.model';
import { IOffice } from 'app/shared/model/office.model';
import { CommonStatus } from 'app/shared/model/enumerations/common-status.model';

export interface ICompany {
  id?: number;
  code?: string;
  name?: string;
  status?: CommonStatus;
  parent?: ICompany;
  departments?: IDepartment[];
  offices?: IOffice[];
}

export class Company implements ICompany {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public status?: CommonStatus,
    public parent?: ICompany,
    public departments?: IDepartment[],
    public offices?: IOffice[]
  ) {}
}

import { IAddress } from 'app/shared/model/address.model';
import { ICompany } from 'app/shared/model/company.model';
import { IDepartment } from 'app/shared/model/department.model';
import { CommonStatus } from 'app/shared/model/enumerations/common-status.model';

export interface IOffice {
  id?: number;
  code?: string;
  name?: string;
  status?: CommonStatus;
  address?: IAddress;
  companies?: ICompany[];
  departments?: IDepartment[];
}

export class Office implements IOffice {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public status?: CommonStatus,
    public address?: IAddress,
    public companies?: ICompany[],
    public departments?: IDepartment[]
  ) {}
}

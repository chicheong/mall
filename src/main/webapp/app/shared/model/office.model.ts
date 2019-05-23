import { IAddress } from 'app/shared/model/address.model';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { ICompany } from 'app/shared/model/company.model';
import { IDepartment } from 'app/shared/model/department.model';

export const enum CommonStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface IOffice {
    id?: number;
    code?: string;
    name?: string;
    status?: CommonStatus;
    address?: IAddress;
    accounts?: IMyAccount[];
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
        public accounts?: IMyAccount[],
        public companies?: ICompany[],
        public departments?: IDepartment[]
    ) {}
}

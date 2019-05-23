import { ICompany } from 'app/shared/model/company.model';
import { IDepartment } from 'app/shared/model/department.model';
import { IOffice } from 'app/shared/model/office.model';
import { IMyAccount } from 'app/shared/model/my-account.model';

export const enum CommonStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface ICompany {
    id?: number;
    code?: string;
    name?: string;
    status?: CommonStatus;
    parent?: ICompany;
    departments?: IDepartment[];
    offices?: IOffice[];
    accounts?: IMyAccount[];
}

export class Company implements ICompany {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public status?: CommonStatus,
        public parent?: ICompany,
        public departments?: IDepartment[],
        public offices?: IOffice[],
        public accounts?: IMyAccount[]
    ) {}
}

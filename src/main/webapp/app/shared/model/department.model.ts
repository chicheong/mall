import { IDepartment } from 'app/shared/model/department.model';
import { IOffice } from 'app/shared/model/office.model';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { ICompany } from 'app/shared/model/company.model';

export const enum CommonStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface IDepartment {
    id?: number;
    code?: string;
    name?: string;
    status?: CommonStatus;
    parent?: IDepartment;
    offices?: IOffice[];
    accounts?: IMyAccount[];
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
        public accounts?: IMyAccount[],
        public companies?: ICompany[]
    ) {}
}

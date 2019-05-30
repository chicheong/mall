import { Moment } from 'moment';
import { IMyAccount } from 'app/shared/model/my-account.model';

export const enum DelegationType {
    ACCOUNT = 'ACCOUNT',
    COMPANY = 'COMPANY',
    DEPARTMENT = 'DEPARTMENT',
    OFFICE = 'OFFICE'
}

export const enum CommonStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface IDelegation {
    id?: number;
    from?: Moment;
    to?: Moment;
    type?: DelegationType;
    delegateId?: string;
    status?: CommonStatus;
    createdBy?: string;
    createdDate?: Moment;
    lastModifiedBy?: string;
    lastModifiedDate?: Moment;
    account?: IMyAccount;
}

export class Delegation implements IDelegation {
    constructor(
        public id?: number,
        public from?: Moment,
        public to?: Moment,
        public type?: DelegationType,
        public delegateId?: string,
        public status?: CommonStatus,
        public createdBy?: string,
        public createdDate?: Moment,
        public lastModifiedBy?: string,
        public lastModifiedDate?: Moment,
        public account?: IMyAccount
    ) {}
}

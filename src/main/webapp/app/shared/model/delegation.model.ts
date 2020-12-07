import { Moment } from 'moment';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { DelegationType } from 'app/shared/model/enumerations/delegation-type.model';
import { CommonStatus } from 'app/shared/model/enumerations/common-status.model';

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

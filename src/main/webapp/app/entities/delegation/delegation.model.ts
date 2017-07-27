import { BaseEntity } from './../../shared';

const enum DelegationType {
    'ACCOUNT',
    'COMPANY',
    'DEPARTMENT',
    'OFFICE'
}

const enum CommonStatus {
    'ACTIVE',
    'INACTIVE'
}

export class Delegation implements BaseEntity {
    constructor(
        public id?: number,
        public from?: any,
        public to?: any,
        public type?: DelegationType,
        public delegateId?: string,
        public status?: CommonStatus,
        public createdBy?: string,
        public createdDate?: any,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public account?: BaseEntity,
    ) {
    }
}

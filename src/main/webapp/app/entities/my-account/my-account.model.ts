import { BaseEntity } from './../../shared';

export const enum AccountType {
    'PERSONAL',
    'COMPANY'
}

export class MyAccount implements BaseEntity {
    constructor(
        public id?: number,
        public type?: AccountType,
        public delegations?: BaseEntity[],
        public company?: BaseEntity,
        public department?: BaseEntity,
        public office?: BaseEntity,
        public shops?: BaseEntity[],
        public userInfos?: BaseEntity[],
    ) {
    }
}

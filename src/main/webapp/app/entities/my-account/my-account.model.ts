import { BaseEntity } from './../../shared';
import { Shop } from './../shop';

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
        public shops?: Shop[],
        public userInfos?: BaseEntity[],
    ) {
    }
}

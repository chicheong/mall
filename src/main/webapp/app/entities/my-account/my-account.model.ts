import { BaseEntity } from './../../shared';
import { Shop } from './../shop';
import { MyOrder } from './../my-order';

export const enum AccountType {
    'PERSONAL',
    'COMPANY'
}

export class MyAccount implements BaseEntity {
    constructor(
        public id?: number,
        public balance?: number,
        public type?: AccountType,
        public delegations?: BaseEntity[],
        public company?: BaseEntity,
        public department?: BaseEntity,
        public office?: BaseEntity,
        public shops?: Shop[],
        public userInfos?: BaseEntity[],
        public myOrder?: MyOrder,
    ) {
    }
}

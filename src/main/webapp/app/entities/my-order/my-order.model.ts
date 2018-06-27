import { BaseEntity } from './../../shared';
import { OrderItem } from './../order-item';
import { Shipping } from './../shipping';

export const enum CurrencyType {
    'HKD',
    'CNY',
    'USD',
    'EUR',
    'JPY',
    'KRW',
    'TWD'
}

export const enum OrderStatus {
    'PENDING',
    'COMFIRMED',
    'COMPLETED',
    'CANCELLED'
}

export class MyOrder implements BaseEntity {
    constructor(
        public id?: number,
        public total?: number,
        public currency?: CurrencyType,
        public remark?: string,
        public status?: OrderStatus,
        public accountId?: number,
        public shipping?: Shipping,
        public items?: OrderItem[],
        public statusHistories?: BaseEntity[],

    ) {
    }
}

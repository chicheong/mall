import { BaseEntity } from './../../shared';
import { OrderItem } from './../order-item';
import { Shop } from './../shop';
import { MyOrder } from './../my-order';
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

export class OrderShop implements BaseEntity {
    constructor(
        public id?: number,
        public total?: number,
        public currency?: CurrencyType,
        public remark?: string,
        public shipping?: Shipping,
        public shop?: Shop,
        public items?: OrderItem[],
        public order?: MyOrder,
    ) {
    }
}

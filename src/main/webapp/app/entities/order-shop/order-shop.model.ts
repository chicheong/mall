import { BaseEntity } from './../../shared';
import { ProductItem } from './../product-item';
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
        public items?: ProductItem[],
        public order?: MyOrder,
    ) {
    }
}

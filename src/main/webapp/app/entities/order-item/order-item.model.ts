import { BaseEntity } from './../../shared';
import { ProductItem } from './../product-item';

export const enum CurrencyType {
    'HKD',
    'CNY',
    'USD',
    'EUR',
    'JPY',
    'KRW',
    'TWD'
}

export class OrderItem implements BaseEntity {
    constructor(
        public id?: number,
        public quantity?: number,
        public price?: number,
        public currency?: CurrencyType,
        public productItem?: ProductItem,
        public order?: BaseEntity,
    ) {
    }
}

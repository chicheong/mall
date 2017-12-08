import { BaseEntity } from './../../shared';

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
        public price?: string,
        public currency?: CurrencyType,
        public productItem?: BaseEntity,
        public order?: BaseEntity,
    ) {
    }
}

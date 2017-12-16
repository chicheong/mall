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

export class Price implements BaseEntity {
    constructor(
        public id?: number,
        public from?: any,
        public to?: any,
        public price?: number,
        public currency?: CurrencyType,
        public item?: BaseEntity,
    ) {
    }
}

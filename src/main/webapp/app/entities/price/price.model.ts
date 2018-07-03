import { BaseEntity } from './../../shared';

export const enum CurrencyType {
    HKD = 'HKD',
    CNY = 'CNY',
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    KRW = 'KRW',
    TWD = 'TWD'
}

export class Price implements BaseEntity {
    constructor(
        public id?: number,
        public tempId?: any,
        public from?: any,
        public to?: any,
        public price?: number,
        public currency?: CurrencyType,
        public item?: BaseEntity,
    ) {
    }
}

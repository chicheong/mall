import { BaseEntity } from './../../shared';

const enum CurrencyType {
    'HKD',
    'CNY',
    'USD',
    'EUR',
    'JPY',
    'KRW',
    'TWD'
}

export class CurrencyRate implements BaseEntity {
    constructor(
        public id?: number,
        public from?: any,
        public to?: any,
        public rate?: number,
        public sourceCurrency?: CurrencyType,
        public targetCurrency?: CurrencyType,
    ) {
    }
}

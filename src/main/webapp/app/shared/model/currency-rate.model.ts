import { Moment } from 'moment';

export const enum CurrencyType {
    HKD = 'HKD',
    CNY = 'CNY',
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    KRW = 'KRW',
    TWD = 'TWD'
}

export interface ICurrencyRate {
    id?: number;
    from?: Moment;
    to?: Moment;
    rate?: number;
    sourceCurrency?: CurrencyType;
    targetCurrency?: CurrencyType;
}

export class CurrencyRate implements ICurrencyRate {
    constructor(
        public id?: number,
        public from?: Moment,
        public to?: Moment,
        public rate?: number,
        public sourceCurrency?: CurrencyType,
        public targetCurrency?: CurrencyType
    ) {}
}

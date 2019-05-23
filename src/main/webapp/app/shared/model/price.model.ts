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

export interface IPrice {
    id?: number;
    from?: Moment;
    to?: Moment;
    price?: number;
    currency?: CurrencyType;
    itemId?: number;
}

export class Price implements IPrice {
    constructor(
        public id?: number,
        public from?: Moment,
        public to?: Moment,
        public price?: number,
        public currency?: CurrencyType,
        public itemId?: number
    ) {}
}

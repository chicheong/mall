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

export interface IProductItemHistory {
    id?: number;
    code?: string;
    isDefault?: boolean;
    quantity?: number;
    currency?: CurrencyType;
    price?: number;
    createdBy?: string;
    createdDate?: Moment;
}

export class ProductItemHistory implements IProductItemHistory {
    constructor(
        public id?: number,
        public code?: string,
        public isDefault?: boolean,
        public quantity?: number,
        public currency?: CurrencyType,
        public price?: number,
        public createdBy?: string,
        public createdDate?: Moment
    ) {
        this.isDefault = this.isDefault || false;
    }
}

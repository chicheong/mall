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

export class ProductItemHistory implements BaseEntity {
    constructor(
        public id?: number,
        public code?: string,
        public isDefault?: boolean,
        public quantity?: number,
        public currency?: CurrencyType,
        public price?: number,
        public createdBy?: string,
        public createdDate?: any,
    ) {
        this.isDefault = false;
    }
}

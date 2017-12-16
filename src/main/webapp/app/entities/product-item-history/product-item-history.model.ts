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
        public name?: string,
        public code?: string,
        public defaultItem?: boolean,
        public color?: string,
        public size?: string,
        public quantity?: number,
        public currency?: CurrencyType,
        public price?: number,
        public createdBy?: string,
        public createdDate?: any,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public item?: BaseEntity,
    ) {
        this.defaultItem = false;
    }
}

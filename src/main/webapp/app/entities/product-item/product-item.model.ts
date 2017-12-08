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

export class ProductItem implements BaseEntity {
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
        public histories?: BaseEntity[],
        public prices?: BaseEntity[],
        public orderItem?: BaseEntity,
        public product?: BaseEntity,
    ) {
        this.defaultItem = false;
    }
}

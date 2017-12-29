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
        public code?: string,
        public isDefault?: boolean,
        public quantity?: number,
        public currency?: CurrencyType,
        public price?: number,
        public color?: BaseEntity,
        public size?: BaseEntity,
        public prices?: BaseEntity[],
        public product?: BaseEntity,
    ) {
        this.isDefault = false;
    }
}

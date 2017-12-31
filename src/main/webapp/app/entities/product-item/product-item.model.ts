import { BaseEntity } from './../../shared';
import { ProductStyle } from './../product-style';

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
        public color?: ProductStyle,
        public size?: ProductStyle,
        public prices?: BaseEntity[],
        public product?: BaseEntity,
    ) {
        this.isDefault = false;
    }
}

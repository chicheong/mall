import { BaseEntity } from './../../shared';
import { ProductStyle } from './../product-style';
import { Price, CurrencyType } from './../price';
import { Quantity } from './../quantity';

export class ProductItem implements BaseEntity {
    constructor(
        public id?: number,
        public tempId?: any,
        public code?: string,
        public isDefault?: boolean,
        public quantity?: number,
        public currency?: CurrencyType,
        public price?: number,
        public color?: ProductStyle,
        public size?: ProductStyle,
        public prices?: Price[],
        public quantities?: Quantity[],
        public product?: BaseEntity,
        public dirtyPrices?: boolean,
        public dirtyQuantities?: boolean,
    ) {
        this.isDefault = false;
    }
}

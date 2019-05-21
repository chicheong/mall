import { BaseEntity } from './../../shared';
import { ProductStyle } from './../product-style';
import { Price, CurrencyType } from './../price';
import { Quantity } from './../quantity';
import { Url } from './../url';

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
        public url?: Url,
        public dirtyPrices?: boolean,
        public dirtyQuantities?: boolean,
        public dirtyUrl?: boolean,
    ) {
        this.isDefault = false;
    }
}

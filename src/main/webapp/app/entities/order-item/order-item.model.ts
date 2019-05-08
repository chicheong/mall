import { BaseEntity } from './../../shared';
import { ProductItem } from './../product-item';
import { CurrencyType } from './../price';

export class OrderItem implements BaseEntity {
    constructor(
        public id?: number,
        public quantity?: number,
        public price?: number,
        public currency?: CurrencyType,
        public productItem?: ProductItem,
        public shop?: BaseEntity,
    ) {
    }
}

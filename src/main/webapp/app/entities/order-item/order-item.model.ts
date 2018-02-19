import { BaseEntity } from './../../shared';
import { ProductItem, CurrencyType } from './../product-item';

export class OrderItem implements BaseEntity {
    constructor(
        public id?: number,
        public quantity?: number,
        public price?: number,
        public currency?: CurrencyType,
        public productItem?: ProductItem,
        public order?: BaseEntity,
    ) {
    }
}

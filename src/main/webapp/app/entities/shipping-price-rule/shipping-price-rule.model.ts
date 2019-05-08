import { BaseEntity } from './../../shared';

export class ShippingPriceRule implements BaseEntity {
    constructor(
        public id?: number,
        public type?: string,
        public value?: number,
        public price?: number,
        public shop?: BaseEntity,
    ) {
    }
}

import { BaseEntity } from './../../shared';
import { CurrencyType } from './../price';

export class ShippingType implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public price?: number,
        public currency?: CurrencyType,
    ) {
    }
}

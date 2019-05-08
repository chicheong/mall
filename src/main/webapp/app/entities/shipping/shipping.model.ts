import { BaseEntity } from './../../shared';
import { MyOrder } from './../my-order';
import { OrderShop } from './../order-shop';
import { Address } from './../address';
import { ShippingType } from './../shipping-type';
import { CurrencyType } from './../price';

export const enum ShippingStatus {
    PENDING = 'PENDING',
    SHIPPED = 'SHIPPED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export class Shipping implements BaseEntity {
    constructor(
        public id?: number,
        public price?: number,
        public currency?: CurrencyType,
        public date?: any,
        public status?: ShippingStatus,
        public shop?: OrderShop,
        public statusHistories?: BaseEntity[],
        public type?: ShippingType,
    ) {
    }
}

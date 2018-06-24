import { BaseEntity } from './../../shared';
import { MyOrder } from './../my-order';
import { Address } from './../address';
import { ShippingType } from './../shipping-type';

export const enum CurrencyType {
    'HKD',
    'CNY',
    'USD',
    'EUR',
    'JPY',
    'KRW',
    'TWD'
}

export const enum ShippingStatus {
    'PENDING',
    'SHIPPED',
    'COMPLETED',
    'CANCELLED'
}

export class Shipping implements BaseEntity {
    constructor(
        public id?: number,
        public price?: number,
        public currency?: CurrencyType,
        public date?: any,
        public receiver?: string,
        public contactNum?: string,
        public email?: string,
        public remark?: string,
        public status?: ShippingStatus,
        public order?: MyOrder,
        public shippingAddress?: Address,
        public billingAddress?: Address,
        public statusHistories?: BaseEntity[],
        public type?: ShippingType,
    ) {
    }
}

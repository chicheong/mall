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
        public orderId?: number,
        public shippingAddressId?: number,
        public billingAddressId?: number,
        public statusHistories?: BaseEntity[],
        public typeId?: number,
    ) {
    }
}
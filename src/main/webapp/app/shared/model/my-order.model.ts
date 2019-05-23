import { IOrderShop } from 'app/shared/model/order-shop.model';
import { IOrderStatusHistory } from 'app/shared/model/order-status-history.model';

export const enum CurrencyType {
    HKD = 'HKD',
    CNY = 'CNY',
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    KRW = 'KRW',
    TWD = 'TWD'
}

export const enum OrderStatus {
    PENDING = 'PENDING',
    COMFIRMED = 'COMFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface IMyOrder {
    id?: number;
    receiver?: string;
    total?: number;
    currency?: CurrencyType;
    contactNum?: string;
    email?: string;
    remark?: string;
    status?: OrderStatus;
    shippingAddressId?: number;
    billingAddressId?: number;
    shops?: IOrderShop[];
    statusHistories?: IOrderStatusHistory[];
    accountId?: number;
}

export class MyOrder implements IMyOrder {
    constructor(
        public id?: number,
        public receiver?: string,
        public total?: number,
        public currency?: CurrencyType,
        public contactNum?: string,
        public email?: string,
        public remark?: string,
        public status?: OrderStatus,
        public shippingAddressId?: number,
        public billingAddressId?: number,
        public shops?: IOrderShop[],
        public statusHistories?: IOrderStatusHistory[],
        public accountId?: number
    ) {}
}

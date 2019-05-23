import { IOrderItem } from 'app/shared/model/order-item.model';

export const enum CurrencyType {
    HKD = 'HKD',
    CNY = 'CNY',
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    KRW = 'KRW',
    TWD = 'TWD'
}

export interface IOrderShop {
    id?: number;
    total?: number;
    currency?: CurrencyType;
    remark?: string;
    shippingId?: number;
    shopId?: number;
    items?: IOrderItem[];
    orderId?: number;
}

export class OrderShop implements IOrderShop {
    constructor(
        public id?: number,
        public total?: number,
        public currency?: CurrencyType,
        public remark?: string,
        public shippingId?: number,
        public shopId?: number,
        public items?: IOrderItem[],
        public orderId?: number
    ) {}
}

import { IOrderShop } from 'app/shared/model/order-shop.model';
import { IOrderStatusHistory } from 'app/shared/model/order-status-history.model';
import { IAddress } from 'app/shared/model/address.model';
import { IPayment } from 'app/shared/model/payment.model';
import { CurrencyType } from './price.model';

export const enum OrderStatus {
    PENDING = 'PENDING',
    CHECKOUT = 'CHECKOUT',
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
    shippingAddress?: IAddress;
    billingAddress?: IAddress;
    payment?: IPayment;
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
        public shippingAddress?: IAddress,
        public billingAddress?: IAddress,
        public payment?: IPayment,
        public shops?: IOrderShop[],
        public statusHistories?: IOrderStatusHistory[],
        public accountId?: number
    ) {}
}

export class PaypalOrderItem {
    constructor(
        public name?: string,
        public description?: string,
        public quantity?: number,
        public price?: number,
        public tax?: number,
        public sku?: string,
        public currency?: CurrencyType,
    ) {
    }
}

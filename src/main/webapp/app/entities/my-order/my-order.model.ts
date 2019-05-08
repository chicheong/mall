import { BaseEntity } from './../../shared';
import { OrderItem } from './../order-item';
import { Shipping } from './../shipping';
import { Payment } from './../payment';
import { Address } from './../address';
import { OrderShop } from './../order-shop';
import { CurrencyType } from './../price';

export const enum OrderStatus {
    'PENDING',
    'COMFIRMED',
    'COMPLETED',
    'CANCELLED'
}

export class MyOrder implements BaseEntity {
    constructor(
        public id?: number,
        public receiver?: string,
        public total?: number,
        public currency?: CurrencyType,
        public contactNum?: string,
        public email?: string,
        public remark?: string,
        public status?: OrderStatus,
		public accountId?: number,
        public shippingAddress?: Address,
        public billingAddress?: Address,
        public payment?: Payment,
        public shops?: OrderShop[],
        public statusHistories?: BaseEntity[]
    ) {
    }
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

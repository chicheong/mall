import { Moment } from 'moment';
import { IOrderShop } from 'app/shared/model/order-shop.model';
import { IShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';
import { IShippingType } from 'app/shared/model/shipping-type.model';
import { CurrencyType } from './price.model';

export const enum ShippingStatus {
    PENDING = 'PENDING',
    SHIPPED = 'SHIPPED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface IShipping {
    id?: number;
    price?: number;
    currency?: CurrencyType;
    date?: Moment;
    status?: ShippingStatus;
    shop?: IOrderShop;
    statusHistories?: IShippingStatusHistory[];
    type?: IShippingType;
}

export class Shipping implements IShipping {
    constructor(
        public id?: number,
        public price?: number,
        public currency?: CurrencyType,
        public date?: Moment,
        public status?: ShippingStatus,
        public shop?: IOrderShop,
        public statusHistories?: IShippingStatusHistory[],
        public type?: IShippingType
    ) {}
}

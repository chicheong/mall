import { Moment } from 'moment';
import { IShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';

export const enum CurrencyType {
    HKD = 'HKD',
    CNY = 'CNY',
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    KRW = 'KRW',
    TWD = 'TWD'
}

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
    statusHistories?: IShippingStatusHistory[];
    typeId?: number;
}

export class Shipping implements IShipping {
    constructor(
        public id?: number,
        public price?: number,
        public currency?: CurrencyType,
        public date?: Moment,
        public status?: ShippingStatus,
        public statusHistories?: IShippingStatusHistory[],
        public typeId?: number
    ) {}
}

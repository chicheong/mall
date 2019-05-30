import { Moment } from 'moment';
import { IProductItem } from 'app/shared/model/product-item.model';

export const enum CurrencyType {
    HKD = 'HKD',
    CNY = 'CNY',
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    KRW = 'KRW',
    TWD = 'TWD'
}

export interface IPrice {
    id?: number;
    tempId?: any;
    from?: Moment;
    to?: Moment;
    price?: number;
    currency?: CurrencyType;
    item?: IProductItem;
}

export class Price implements IPrice {
    constructor(
        public id?: number,
        public tempId?: any,
        public from?: Moment,
        public to?: Moment,
        public price?: number,
        public currency?: CurrencyType,
        public item?: IProductItem
    ) {}
}

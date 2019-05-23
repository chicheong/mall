import { IPrice } from 'app/shared/model/price.model';
import { IQuantity } from 'app/shared/model/quantity.model';

export const enum CurrencyType {
    HKD = 'HKD',
    CNY = 'CNY',
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    KRW = 'KRW',
    TWD = 'TWD'
}

export interface IProductItem {
    id?: number;
    code?: string;
    isDefault?: boolean;
    quantity?: number;
    currency?: CurrencyType;
    price?: number;
    colorId?: number;
    sizeId?: number;
    prices?: IPrice[];
    quantities?: IQuantity[];
    productId?: number;
}

export class ProductItem implements IProductItem {
    constructor(
        public id?: number,
        public code?: string,
        public isDefault?: boolean,
        public quantity?: number,
        public currency?: CurrencyType,
        public price?: number,
        public colorId?: number,
        public sizeId?: number,
        public prices?: IPrice[],
        public quantities?: IQuantity[],
        public productId?: number
    ) {
        this.isDefault = this.isDefault || false;
    }
}

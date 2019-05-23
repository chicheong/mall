export const enum CurrencyType {
    HKD = 'HKD',
    CNY = 'CNY',
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    KRW = 'KRW',
    TWD = 'TWD'
}

export interface IOrderItem {
    id?: number;
    quantity?: number;
    price?: number;
    currency?: CurrencyType;
    productItemId?: number;
    shopId?: number;
}

export class OrderItem implements IOrderItem {
    constructor(
        public id?: number,
        public quantity?: number,
        public price?: number,
        public currency?: CurrencyType,
        public productItemId?: number,
        public shopId?: number
    ) {}
}

export const enum CurrencyType {
    HKD = 'HKD',
    CNY = 'CNY',
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    KRW = 'KRW',
    TWD = 'TWD'
}

export interface IShippingType {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    currency?: CurrencyType;
}

export class ShippingType implements IShippingType {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public price?: number,
        public currency?: CurrencyType
    ) {}
}

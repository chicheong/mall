import { IShop } from 'app/shared/model/shop.model';

export const enum ShippingPriceRuleType {
    FIXED_PER_ORDER = 'FIXED_PER_ORDER',
    TOTAL_PERCENTAGE = ' TOTAL_PERCENTAGE',
    PRICE_LARGER_THAN = ' PRICE_LARGER_THAN',
    PRICE_LARGER_THAN_OR_EQUAL = ' PRICE_LARGER_THAN_OR_EQUAL',
    PRICE_SMALLER_THAN = ' PRICE_SMALLER_THAN',
    PRICE_SMALLER_THAN_OR_EQUAL = ' PRICE_SMALLER_THAN_OR_EQUAL',
    QUANTITY_LARGER_THAN = ' QUANTITY_LARGER_THAN',
    QUANTITY_LARGER_THAN_OR_EQUAL = ' QUANTITY_LARGER_THAN_OR_EQUAL',
    QUANTITY_SMALLER_THAN = ' QUANTITY_SMALLER_THAN',
    QUANTITY_SMALLER_THAN_OR_EQUAL = ' QUANTITY_SMALLER_THAN_OR_EQUAL'
}

export interface IShippingPriceRule {
    id?: number;
    type?: ShippingPriceRuleType;
    value?: number;
    price?: number;
    sequence?: number;
    shop?: IShop;
}

export class ShippingPriceRule implements IShippingPriceRule {
    constructor(
        public id?: number,
        public type?: ShippingPriceRuleType,
        public value?: number,
        public price?: number,
        public sequence?: number,
        public shop?: IShop
    ) {}
}

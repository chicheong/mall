import { IShop } from 'app/shared/model/shop.model';

export interface IShippingPriceRule {
    id?: number;
    type?: string;
    value?: number;
    price?: number;
    shop?: IShop;
}

export class ShippingPriceRule implements IShippingPriceRule {
    constructor(public id?: number, public type?: string, public value?: number, public price?: number, public shop?: IShop) {}
}

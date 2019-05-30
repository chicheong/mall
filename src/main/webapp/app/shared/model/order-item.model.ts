import { IProductItem } from 'app/shared/model/product-item.model';
import { IOrderShop } from 'app/shared/model/order-shop.model';
import { CurrencyType } from './price.model';

export interface IOrderItem {
    id?: number;
    quantity?: number;
    price?: number;
    currency?: CurrencyType;
    productItem?: IProductItem;
    shop?: IOrderShop;
}

export class OrderItem implements IOrderItem {
    constructor(
        public id?: number,
        public quantity?: number,
        public price?: number,
        public currency?: CurrencyType,
        public productItem?: IProductItem,
        public shop?: IOrderShop
    ) {}
}

import { IProductItem } from 'app/shared/model/product-item.model';
import { IOrderShop } from 'app/shared/model/order-shop.model';
import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';

export interface IOrderItem {
    id?: number;
    quantity?: number;
    price?: number;
    currency?: CurrencyType;
    productItem?: IProductItem;
    shop?: IOrderShop;
    isChecked?: boolean;
}

export class OrderItem implements IOrderItem {
    constructor(
        public id?: number,
        public quantity?: number,
        public price?: number,
        public currency?: CurrencyType,
        public productItem?: IProductItem,
        public shop?: IOrderShop,
        public isChecked?: boolean
    ) {
        this.isChecked = false;
    }
}

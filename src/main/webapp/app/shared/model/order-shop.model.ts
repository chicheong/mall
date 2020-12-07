import { IShipping } from 'app/shared/model/shipping.model';
import { IShop } from 'app/shared/model/shop.model';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { IMyOrder } from 'app/shared/model/my-order.model';
import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';

export interface IOrderShop {
    id?: number;
    total?: number;
    currency?: CurrencyType;
    remark?: string;
    shipping?: IShipping;
    shop?: IShop;
    items?: IOrderItem[];
    order?: IMyOrder;
}

export class OrderShop implements IOrderShop {
    constructor(
        public id?: number,
        public total?: number,
        public currency?: CurrencyType,
        public remark?: string,
        public shipping?: IShipping,
        public shop?: IShop,
        public items?: IOrderItem[],
        public order?: IMyOrder,
        public isChecked?: boolean,
        public indeterminate?: boolean
    ) {
        this.isChecked = false;
        this.indeterminate = false;
    }
}

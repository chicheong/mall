import { Moment } from 'moment';
import { IProductItem } from 'app/shared/model/product-item.model';

export interface IQuantity {
    id?: number;
    tempId?: any;
    from?: Moment;
    to?: Moment;
    quantity?: number;
    item?: IProductItem;
}

export class Quantity implements IQuantity {
    constructor(public id?: number, public tempId?: any, public from?: Moment, public to?: Moment, public quantity?: number, public item?: IProductItem) {}
}

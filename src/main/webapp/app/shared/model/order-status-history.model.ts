import { Moment } from 'moment';
import { IMyOrder } from 'app/shared/model/my-order.model';

export const enum OrderStatus {
    PENDING = 'PENDING',
    COMFIRMED = 'COMFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface IOrderStatusHistory {
    id?: number;
    effectiveDate?: Moment;
    status?: OrderStatus;
    order?: IMyOrder;
}

export class OrderStatusHistory implements IOrderStatusHistory {
    constructor(public id?: number, public effectiveDate?: Moment, public status?: OrderStatus, public order?: IMyOrder) {}
}

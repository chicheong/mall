import { Moment } from 'moment';

export interface IQuantity {
    id?: number;
    from?: Moment;
    to?: Moment;
    quantity?: number;
    itemId?: number;
}

export class Quantity implements IQuantity {
    constructor(public id?: number, public from?: Moment, public to?: Moment, public quantity?: number, public itemId?: number) {}
}

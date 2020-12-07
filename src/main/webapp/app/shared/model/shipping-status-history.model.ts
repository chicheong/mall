import { Moment } from 'moment';
import { IShipping } from 'app/shared/model/shipping.model';
import { ShippingStatus } from 'app/shared/model/enumerations/shipping-status.model';

export interface IShippingStatusHistory {
  id?: number;
  effectiveDate?: Moment;
  status?: ShippingStatus;
  shipping?: IShipping;
}

export class ShippingStatusHistory implements IShippingStatusHistory {
  constructor(public id?: number, public effectiveDate?: Moment, public status?: ShippingStatus, public shipping?: IShipping) {}
}

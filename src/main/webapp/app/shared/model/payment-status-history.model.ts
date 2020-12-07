import { Moment } from 'moment';
import { IPayment } from 'app/shared/model/payment.model';
import { PaymentStatus } from 'app/shared/model/enumerations/payment-status.model';

export interface IPaymentStatusHistory {
  id?: number;
  effectiveDate?: Moment;
  status?: PaymentStatus;
  payment?: IPayment;
}

export class PaymentStatusHistory implements IPaymentStatusHistory {
  constructor(public id?: number, public effectiveDate?: Moment, public status?: PaymentStatus, public payment?: IPayment) {}
}

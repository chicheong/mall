import { IMyOrder } from 'app/shared/model/my-order.model';
import { IPaymentCard } from 'app/shared/model/payment-card.model';
import { IPaymentStatusHistory } from 'app/shared/model/payment-status-history.model';
import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';
import { PaymentType } from 'app/shared/model/enumerations/payment-type.model';
import { PaymentStatus } from 'app/shared/model/enumerations/payment-status.model';

export interface IPayment {
    id?: number;
    amount?: number;
    currency?: CurrencyType;
    type?: PaymentType;
    remark?: string;
    status?: PaymentStatus;
    order?: IMyOrder;
    token?: string;
    paymentCard?: IPaymentCard;
    statusHistories?: IPaymentStatusHistory[];
}

export class Payment implements IPayment {
    constructor(
        public id?: number,
        public amount?: number,
        public currency?: CurrencyType,
        public type?: PaymentType,
        public remark?: string,
        public status?: PaymentStatus,
        public order?: IMyOrder,
        public token?: string,
        public paymentCard?: IPaymentCard,
        public statusHistories?: IPaymentStatusHistory[]
    ) {}
}

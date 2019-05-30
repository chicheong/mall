import { IMyOrder } from 'app/shared/model/my-order.model';
import { IPaymentCard } from 'app/shared/model/payment-card.model';
import { IPaymentStatusHistory } from 'app/shared/model/payment-status-history.model';
import { CurrencyType } from './price.model';

export const enum PaymentType {
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    PAYPAL = 'PAYPAL',
    PAYME = 'PAYME',
    BANK_TRANSFER = 'BANK_TRANSFER',
    ACCOUNT = 'ACCOUNT'
}

export const enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED'
}

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

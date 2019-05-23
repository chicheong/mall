import { IPaymentStatusHistory } from 'app/shared/model/payment-status-history.model';

export const enum CurrencyType {
    HKD = 'HKD',
    CNY = 'CNY',
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    KRW = 'KRW',
    TWD = 'TWD'
}

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
    orderId?: number;
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
        public orderId?: number,
        public statusHistories?: IPaymentStatusHistory[]
    ) {}
}

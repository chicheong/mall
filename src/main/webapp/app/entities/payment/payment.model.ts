import { BaseEntity } from './../../shared';
import { MyOrder } from './../my-order';
import { CurrencyType } from './../price';

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

export class Payment implements BaseEntity {
    constructor(
        public id?: number,
        public amount?: number,
        public currency?: CurrencyType,
        public type?: PaymentType,
        public remark?: string,
        public status?: PaymentStatus,
        public order?: MyOrder,
        public statusHistories?: BaseEntity[],
    ) {
    }
}

import { BaseEntity } from './../../shared';
import { MyOrder } from './../my-order';

export const enum CurrencyType {
    'HKD',
    'CNY',
    'USD',
    'EUR',
    'JPY',
    'KRW',
    'TWD'
}

export const enum PaymentType {
    'CREDIT_CARD',
    'DEBIT_CARD',
    'PAYPAL',
    'PAYME',
    'BANK_TRANSFER',
    'ACCOUNT'
}

export const enum PaymentStatus {
    'PENDING',
    'PAID',
    'CANCELLED'
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
    ) {
    }
}

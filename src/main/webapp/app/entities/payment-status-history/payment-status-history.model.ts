import { BaseEntity } from './../../shared';

export const enum PaymentStatus {
    'PENDING',
    'PAID',
    'CANCELLED'
}

export class PaymentStatusHistory implements BaseEntity {
    constructor(
        public id?: number,
        public effectiveDate?: any,
        public status?: PaymentStatus,
        public payment?: BaseEntity,
    ) {
    }
}

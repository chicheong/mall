import { BaseEntity } from './../../shared';

export const enum ShippingStatus {
    'PENDING',
    'SHIPPED',
    'COMPLETED',
    'CANCELLED'
}

export class ShippingStatusHistory implements BaseEntity {
    constructor(
        public id?: number,
        public effectiveDate?: any,
        public status?: ShippingStatus,
        public shipping?: BaseEntity,
    ) {
    }
}

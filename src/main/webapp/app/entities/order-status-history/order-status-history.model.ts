import { BaseEntity } from './../../shared';

const enum OrderStatus {
    'PENDING',
    'COMFIRMED',
    'COMPLETED',
    'CANCELLED'
}

export class OrderStatusHistory implements BaseEntity {
    constructor(
        public id?: number,
        public effectiveDate?: any,
        public status?: OrderStatus,
        public order?: BaseEntity,
    ) {
    }
}

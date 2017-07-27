import { BaseEntity } from './../../shared';

const enum CurrencyType {
    'HKD',
    'CNY',
    'USD',
    'EUR',
    'JPY',
    'KRW',
    'TWD'
}

const enum OrderStatus {
    'PENDING',
    'COMFIRMED',
    'COMPLETED',
    'CANCELLED'
}

export class Order implements BaseEntity {
    constructor(
        public id?: number,
        public total?: number,
        public currency?: CurrencyType,
        public remark?: string,
        public status?: OrderStatus,
        public items?: BaseEntity[],
        public statusHistories?: BaseEntity[],
        public userInfo?: BaseEntity,
    ) {
    }
}

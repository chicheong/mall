import { BaseEntity } from './../../shared';

const enum CommonStatus {
    'ACTIVE',
    'INACTIVE'
}

export class Company implements BaseEntity {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public status?: CommonStatus,
        public parent?: BaseEntity,
        public departments?: BaseEntity[],
        public offices?: BaseEntity[],
        public accounts?: BaseEntity[],
    ) {
    }
}

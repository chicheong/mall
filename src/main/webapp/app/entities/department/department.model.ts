import { BaseEntity } from './../../shared';

const enum CommonStatus {
    'ACTIVE',
    'INACTIVE'
}

export class Department implements BaseEntity {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public status?: CommonStatus,
        public parent?: BaseEntity,
        public offices?: BaseEntity[],
        public accounts?: BaseEntity[],
        public companies?: BaseEntity[],
    ) {
    }
}

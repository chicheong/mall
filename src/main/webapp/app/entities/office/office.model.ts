import { BaseEntity } from './../../shared';

export const enum CommonStatus {
    'ACTIVE',
    'INACTIVE'
}

export class Office implements BaseEntity {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public status?: CommonStatus,
        public address?: BaseEntity,
        public accounts?: BaseEntity[],
        public companies?: BaseEntity[],
        public departments?: BaseEntity[],
    ) {
    }
}

import { BaseEntity } from './../../shared';

const enum CategoryStatus {
    'ACTIVE',
    'RESTRICTED',
    'INACTIVE'
}

export class Category implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public status?: CategoryStatus,
        public createdBy?: string,
        public createdDate?: any,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public parent?: BaseEntity,
        public products?: BaseEntity[],
    ) {
    }
}

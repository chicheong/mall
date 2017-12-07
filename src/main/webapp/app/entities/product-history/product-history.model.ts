import { BaseEntity } from './../../shared';

const enum ProductStatus {
    'ACTIVE',
    'RESTRICTED',
    'INACTIVE'
}

export class ProductHistory implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public code?: string,
        public brand?: string,
        public description?: string,
        public content?: string,
        public remark?: string,
        public status?: ProductStatus,
        public createdBy?: string,
        public createdDate?: any,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public product?: BaseEntity,
    ) {
    }
}

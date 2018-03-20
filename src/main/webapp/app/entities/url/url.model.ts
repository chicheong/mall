import { BaseEntity } from './../../shared';

export const enum EntityType {
    'PRODUCT',
    'PRODUCTITEM'
}

export class Url implements BaseEntity {
    constructor(
        public id?: number,
        public entityType?: EntityType,
        public entityId?: number,
        public path?: string,
        public description?: string,
        public createdBy?: string,
        public createdDate?: any,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
    ) {
    }
}

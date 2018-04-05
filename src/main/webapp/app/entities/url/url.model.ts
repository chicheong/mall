import { BaseEntity } from './../../shared';

export class Url implements BaseEntity {
    constructor(
        public id?: number,
        public entityType?: string,
        public entityId?: number,
        public path?: string,
        public fileName?: string,
        public sequence?: number,
        public description?: string,
        public createdBy?: string,
        public createdDate?: any,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
    ) {
    }
}

import { BaseEntity } from './../../shared';

export class Address implements BaseEntity {
    constructor(
        public id?: number,
        public line1?: string,
        public line2?: string,
        public line3?: string,
        public line4?: string,
        public city?: string,
        public postalCode?: string,
        public country?: BaseEntity,
        public state?: BaseEntity,
    ) {
    }
}

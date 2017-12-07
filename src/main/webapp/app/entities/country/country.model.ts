import { BaseEntity } from './../../shared';

export class Country implements BaseEntity {
    constructor(
        public id?: number,
        public code?: string,
        public label?: string,
        public num?: string,
        public name?: string,
    ) {
    }
}

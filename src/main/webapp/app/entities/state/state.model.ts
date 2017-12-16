import { BaseEntity } from './../../shared';

export class State implements BaseEntity {
    constructor(
        public id?: number,
        public code?: string,
        public label?: string,
        public name?: string,
        public country?: BaseEntity,
    ) {
    }
}

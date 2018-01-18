import { BaseEntity } from './../../shared';

export class Quantity implements BaseEntity {
    constructor(
        public id?: any,
        public from?: any,
        public to?: any,
        public quantity?: number,
        public item?: BaseEntity,
    ) {
    }
}

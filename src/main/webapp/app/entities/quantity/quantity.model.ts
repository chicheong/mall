import { BaseEntity } from './../../shared';

export class Quantity implements BaseEntity {
    constructor(
        public id?: number,
        public tempId?: any,
        public from?: any,
        public to?: any,
        public quantity?: number,
        public item?: BaseEntity,
    ) {
    }
}

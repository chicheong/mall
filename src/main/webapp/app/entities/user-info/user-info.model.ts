import { BaseEntity, User } from './../../shared';

export class UserInfo implements BaseEntity {
    constructor(
        public id?: number,
        public user?: User,
        public accounts?: BaseEntity[],
    ) {
    }
}

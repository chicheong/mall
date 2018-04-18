import { BaseEntity, User } from './../../shared';
import { MyAccount } from './../my-account';

export class UserInfo implements BaseEntity {
    constructor(
        public id?: number,
        public accountId?: number,
        public shopId?: number,
        public user?: User,
        public defaultAccount?: BaseEntity,
        public accounts?: MyAccount[],
    ) {
    }
}

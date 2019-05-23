import { IDelegation } from 'app/shared/model/delegation.model';
import { IShop } from 'app/shared/model/shop.model';
import { IUserInfo } from 'app/shared/model/user-info.model';

export const enum AccountType {
    PERSONAL = 'PERSONAL',
    COMPANY = 'COMPANY'
}

export interface IMyAccount {
    id?: number;
    balance?: number;
    type?: AccountType;
    delegations?: IDelegation[];
    companyCode?: string;
    companyId?: number;
    departmentCode?: string;
    departmentId?: number;
    officeCode?: string;
    officeId?: number;
    shops?: IShop[];
    userInfos?: IUserInfo[];
}

export class MyAccount implements IMyAccount {
    constructor(
        public id?: number,
        public balance?: number,
        public type?: AccountType,
        public delegations?: IDelegation[],
        public companyCode?: string,
        public companyId?: number,
        public departmentCode?: string,
        public departmentId?: number,
        public officeCode?: string,
        public officeId?: number,
        public shops?: IShop[],
        public userInfos?: IUserInfo[]
    ) {}
}

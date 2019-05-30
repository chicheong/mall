import { IDelegation } from 'app/shared/model/delegation.model';
import { ICompany } from 'app/shared/model/company.model';
import { IDepartment } from 'app/shared/model/department.model';
import { IOffice } from 'app/shared/model/office.model';
import { IShop } from 'app/shared/model/shop.model';
import { IUserInfo } from 'app/shared/model/user-info.model';
import { IMyOrder } from 'app/shared/model/my-order.model';

export const enum AccountType {
    PERSONAL = 'PERSONAL',
    COMPANY = 'COMPANY'
}

export interface IMyAccount {
    id?: number;
    balance?: number;
    type?: AccountType;
    delegations?: IDelegation[];
    company?: ICompany;
    department?: IDepartment;
    office?: IOffice;
    shops?: IShop[];
    userInfos?: IUserInfo[];
    myOrder?: IMyOrder;
}

export class MyAccount implements IMyAccount {
    constructor(
        public id?: number,
        public balance?: number,
        public type?: AccountType,
        public delegations?: IDelegation[],
        public company?: ICompany,
        public department?: IDepartment,
        public office?: IOffice,
        public shops?: IShop[],
        public userInfos?: IUserInfo[],
        public myOrder?: IMyOrder
    ) {}
}

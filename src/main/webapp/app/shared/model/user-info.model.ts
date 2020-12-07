import { IMyAccount } from 'app/shared/model/my-account.model';

export interface IUserInfo {
  id?: number;
  accountId?: number;
  shopId?: number;
  userLogin?: string;
  userId?: number;
  defaultAccount?: IMyAccount;
  accounts?: IMyAccount[];
}

export class UserInfo implements IUserInfo {
  constructor(
    public id?: number,
    public accountId?: number,
    public shopId?: number,
    public userLogin?: string,
    public userId?: number,
    public defaultAccount?: IMyAccount,
    public accounts?: IMyAccount[]
  ) {}
}

import { IAddress } from 'app/shared/model/address.model';

export interface IContact {
  id?: number;
  name?: string;
  name2?: string;
  phoneNum?: string;
  phoneNum2?: string;
  email?: string;
  remark?: string;
  address?: IAddress;
}

export class Contact implements IContact {
  constructor(
    public id?: number,
    public name?: string,
    public name2?: string,
    public phoneNum?: string,
    public phoneNum2?: string,
    public email?: string,
    public remark?: string,
    public address?: IAddress
  ) {}
}

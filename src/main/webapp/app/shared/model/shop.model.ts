import { Moment } from 'moment';
import { IShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { IProduct } from 'app/shared/model/product.model';
import { CommonStatus } from 'app/shared/model/enumerations/common-status.model';

export interface IShop {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  status?: CommonStatus;
  permission?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastModifiedBy?: string;
  lastModifiedDate?: Moment;
  shippingPriceRules?: IShippingPriceRule[];
  accounts?: IMyAccount[];
  products?: IProduct[];
}

export class Shop implements IShop {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public description?: string,
    public status?: CommonStatus,
    public permission?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Moment,
    public shippingPriceRules?: IShippingPriceRule[],
    public accounts?: IMyAccount[],
	public products?: IProduct[]
  ) {}
}

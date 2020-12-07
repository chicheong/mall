import { IOrderShop } from 'app/shared/model/order-shop.model';
import { IOrderStatusHistory } from 'app/shared/model/order-status-history.model';
import { IAddress } from 'app/shared/model/address.model';
import { IPayment } from 'app/shared/model/payment.model';
import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';
import { OrderStatus } from 'app/shared/model/enumerations/order-status.model';

export interface IMyOrder {
  id?: number;
  total?: number;
  currency?: CurrencyType;
  remark?: string;
  status?: OrderStatus;
  shipping?: IAddress;
  billing?: IAddress;
  payment?: IPayment;
  shops?: IOrderShop[];
  statusHistories?: IOrderStatusHistory[];
  accountId?: number;
}

export class MyOrder implements IMyOrder {
  constructor(
    public id?: number,
    public total?: number,
    public currency?: CurrencyType,
    public remark?: string,
    public status?: OrderStatus,
    public shipping?: IAddress,
    public billing?: IAddress,
	public payment?: IPayment,
    public shops?: IOrderShop[],
    public statusHistories?: IOrderStatusHistory[],
    public accountId?: number
  ) {}
}
export class PaypalOrderItem {
    constructor(
        public name?: string,
        public description?: string,
        public quantity?: number,
        public price?: number,
        public tax?: number,
        public sku?: string,
        public currency?: CurrencyType,
    ) {
    }
}

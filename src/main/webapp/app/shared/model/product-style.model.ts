import { IProduct } from 'app/shared/model/product.model';
import { IMyUrl } from 'app/shared/model/my-url.model';
import { ProductStyleType } from 'app/shared/model/enumerations/product-style-type.model';

export interface IProductStyle {
  id?: number;
  tempId?: any;
  name?: string;
  code?: string;
  isDefault?: boolean;
  type?: ProductStyleType;
  product?: IProduct;
  url?: IMyUrl;
  dirtyUrl?: boolean;
  disabled?: boolean;
}

export class ProductStyle implements IProductStyle {
  constructor(
    public id?: number,
	public tempId?: any,
    public name?: string,
    public code?: string,
    public isDefault?: boolean,
    public type?: ProductStyleType,
    public product?: IProduct,
	public url?: IMyUrl,
	public dirtyUrl?: boolean,
    public disabled?: boolean
  ) {
    this.isDefault = this.isDefault || false;
  }
}

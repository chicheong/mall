import { Pipe, PipeTransform } from '@angular/core';
import { IProductItem } from 'app/shared/model/product-item.model';
import { IProductStyle } from 'app/shared/model/product-style.model';

@Pipe({
  name: 'getItemFromColorSize'
})
export class GetItemFromColorSizePipe implements PipeTransform {
  transform(items: IProductItem[], color: IProductStyle, size: IProductStyle): any[] {
    if (!items) { return []; }
    if (!color) { return items; }
    return items.filter( it => {
        return (it.color.id ? (it.color.id === color.id) : (it.color.tempId === color.tempId)) && (it.size.id ? (it.size.id === size.id) : (it.size.tempId === size.tempId));
    });
   }
}

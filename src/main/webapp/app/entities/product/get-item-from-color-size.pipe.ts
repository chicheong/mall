import { Pipe, PipeTransform } from '@angular/core';
import { ProductStyle, ProductStyleType } from './../product-style';
import { ProductItem } from '../product-item';

@Pipe({
  name: 'getItemFromColorSize'
})
export class GetItemFromColorSizePipe implements PipeTransform {
  transform(items: ProductItem[], color: ProductStyle, size: ProductStyle): any[] {
    if (!items) { return []; }
    if (!color) { return items; }
    return items.filter( (it) => {
        return it.color.id ? (it.color.id === color.id && it.size.id === size.id) : (it.color.tempId === color.tempId && it.size.tempId === size.tempId);
    });
   }
}

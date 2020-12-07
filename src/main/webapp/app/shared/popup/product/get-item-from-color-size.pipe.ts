import { Pipe, PipeTransform } from '@angular/core';
import { IProductStyle } from 'app/shared/model/product-style.model';

import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'getItemFromColorSize'
})
export class GetItemFromColorSizePipe implements PipeTransform {
  transform(items: AbstractControl[], color: IProductStyle, size: IProductStyle): any {
    if (!items) { return []; }
    if (!color) { return items; }
    return items.filter( (it: any) => {
//        console.error('GetItemFromColorSizePipe->it.value.id: ' + it.value.id + ', it.value.tempId: ' + it.value.tempId);
        return (it.value.color ? (it.value.color!.id ? (it.value.color!.id === color.id) : (it.value.color!.tempId === color.tempId)) : true) && (it.value.size ? (it.value.size!.id ? (it.value.size!.id === size.id) : (it.value.size!.tempId === size.tempId)) : true);
    });
   }
}

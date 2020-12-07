import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService } from 'ng-jhipster';

import { IProductItem, ProductItem } from 'app/shared/model/product-item.model';
import { IProductStyle, ProductStyle } from 'app/shared/model/product-style.model';
import { IPrice } from 'app/shared/model/price.model';
import { IQuantity } from 'app/shared/model/quantity.model';
import { IProduct, Product } from 'app/shared/model/product.model';
import { IMyUrl, MyUrl } from 'app/shared/model/my-url.model';

import { GetItemFromColorSizePipe } from './get-item-from-color-size.pipe';

import { FileUploadResult } from 'app/shared/file-upload/file-upload-result.model';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from "@angular/forms";

@Component({
    selector: 'jhi-product-item-url-dialog',
    templateUrl: './product-items-url-dialog.component.html'
})
export class ProductItemsUrlDialogComponent implements OnInit {

    object: IProduct = {};
    productItems: IProductItem[] = [];
    colors?: IProductStyle[];
    sizes?: IProductStyle[];

    fileExt = 'JPG, GIF, PNG';
    maxFiles = 1;
    maxSize = 5; // 5MB
//    broadcastName: string;
//    type: string; // Not in use
    
    editForm = this.fb.group({
        id: [],
        items: this.fb.array([])
    });

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.updateForm(this.object);
        this.colors = this.object.colors;
        this.sizes = this.object.sizes;
        if (!this.colors) {
            this.colors = [new ProductStyle()];
        } else if (this.colors.length === 0) {
            this.colors = [new ProductStyle()];
        } 
        if (!this.sizes) {
            this.sizes = [new ProductStyle()];
        }else if (this.sizes.length === 0) {
            this.sizes = [new ProductStyle()];
        }
    }
    
    updateForm(product: IProduct): void {
        this.editForm = this.fb.group({
                            id: product.id,
                            items: this.convertToFormItems(product.items)
                        });

    }
    
    convertToFormItems(productItems: IProductItem[] | undefined): FormArray {
        const formArray: FormArray = this.fb.array([]);
        if (productItems) {
            productItems.forEach((obj: IProductItem) => {
                formArray.push(this.convertToFormItem(obj));
            });
        }
        return formArray;
    }
    
    convertToFormItem(item: IProductItem): FormGroup {
        console.error('product-items-url-dialog->convertToFormItem->item.dirtyQuantities: ' + item.dirtyQuantities);
        return this.fb.group({
            id: item.id,
            tempId: item.tempId,
            code: item.code,
            isDefault: item.isDefault,
            quantity: item.quantity,
            currency: item.currency,
            price: item.price,
            color: item.color,
            size: item.size,
            prices: item.prices,
            quantities: item.quantities,
            product: item.product,
            url: this.convertToFormUrl(item),
            dirtyPrices: item.dirtyPrices,
            dirtyQuantities: item.dirtyQuantities,
            dirtyUrl: item.dirtyUrl
        });
    }
    
    convertToFormUrl(item: IProductItem): FormGroup {
        if (item.url) {
            const obj = item.url;
            return this.fb.group({
                id: obj.id,
                entityType: obj.entityType,
                entityId: obj.entityId,
                path: obj.path,
                fileName: obj.fileName,
                sequence: obj.sequence,
                description: obj.description,
                createdBy: obj.createdBy,
                createdDate: obj.createdDate,
                lastModifiedBy: obj.lastModifiedBy,
                lastModifiedDate: obj.lastModifiedDate
            });
        } else {
            return this.fb.group({
                id: undefined,
                entityType: ProductItem.name,
                entityId: item.id ? item.id : item.tempId,
                path: undefined,
                fileName: undefined,
                sequence: 1,
                description: undefined,
                createdBy: undefined,
                createdDate: undefined,
                lastModifiedBy: undefined,
                lastModifiedDate: undefined
            });
        }
    }
    
    private createFromForm(): IProduct {
        const product: IProduct = new Product();
        product.id = this.editForm.get(['id'])!.value;
        product.items = [];
        this.items.controls.forEach((itemFormGroup: AbstractControl) => {
            product.items!.push(this.convertFromFormItem(itemFormGroup));
        });
        return product;
    }
    
    private convertFromFormItem(itemFormGroup: AbstractControl): IProductItem {
        const productItem: IProductItem = new ProductItem();
        productItem.id = itemFormGroup.value.id;
        productItem.tempId = itemFormGroup.value.tempId;
        productItem.code = itemFormGroup.value.code;
        productItem.isDefault = itemFormGroup.value.isDefault;
        productItem.quantity = itemFormGroup.value.quantity;
        productItem.currency = itemFormGroup.value.currency;
        productItem.price = itemFormGroup.value.price;
        productItem.color = itemFormGroup.value.color;
        productItem.size = itemFormGroup.value.size;
        productItem.prices = itemFormGroup.value.prices;
        productItem.quantities = itemFormGroup.value.quantities;
        productItem.product = itemFormGroup.value.product;
        productItem.url = itemFormGroup.value.url;
        productItem.dirtyPrices = itemFormGroup.value.dirtyPrices;
        productItem.dirtyQuantities = itemFormGroup.value.dirtyQuantities;
        productItem.dirtyUrl = itemFormGroup.value.dirtyUrl;
        
        return productItem;
    }
    
    get items() : FormArray {
        return this.editForm.get('items') as FormArray;
    }

    clear(): void {
        this.activeModal.dismiss('cancel');
    }

    confirm(): void {
//        this.object.items = this.productItems;
//        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.object});
        this.activeModal.close(this.createFromForm());
    }

    getResult(result: FileUploadResult): void {
        if (result.errors === undefined || result.errors.length === 0) {
            console.error('product-items-url-dialog->getResult->result: ' + result + ', result.urls![0]: ' + result.urls![0]);
            this.updateUrl(result.urls![0]);
        } else {
            result.errors.forEach(error => {
                this.jhiAlertService.error(error.msg, error.params, undefined);
            });
        }
    }
    
    updateUrl(url: IMyUrl): void {
      const index = this.items.value.findIndex((item: IProductItem) => item.id ? item.id === url.entityId : item.tempId === url.entityId);
      console.error('product-items-url-dialog->updateUrl->index: ' + index);
      this.items.value[index].url = url;
      this.items.value[index].dirtyUrl = true;
      this.items.value.forEach((item: IProductItem) => {
          console.error('item.url.path: ' + item.url!.path + ', item.dirtyUrl: ' + item.dirtyUrl);
      });
    }
}

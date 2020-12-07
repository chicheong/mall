import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, AbstractControl, FormGroup } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import * as moment from 'moment';

import { IProductItem, ProductItem } from 'app/shared/model/product-item.model';
import { IProductStyle, ProductStyle } from 'app/shared/model/product-style.model';
import { IPrice, Price } from 'app/shared/model/price.model';
import { IQuantity, Quantity } from 'app/shared/model/quantity.model';
import { IProduct, Product } from 'app/shared/model/product.model';

// import { PopupService } from 'app/shared';
// import { PricesDialogComponent } from './prices-dialog.component';
// import { QuantitiesDialogComponent } from './quantities-dialog.component';

import { UuidService } from 'app/shared/random/uuid.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { PricesDialogComponent } from "app/shared/popup/product/prices-dialog.component";
import { QuantitiesDialogComponent } from "app/shared/popup/product/quantities-dialog.component";
import { DATE_TIME_FORMAT } from "app/shared/constants/input.constants";
import { ModalResultType } from "app/shared/model/enumerations/modal-result-type.model";

export const enum ProductItemsDialogType {
    CODE = 'CODE',
    PRICE = 'PRICE',
    QUANTITY = 'QUANTITY',
    SINGLE = 'SINGLE',
    ALL = 'ALL'
}

@Component({
    selector: 'jhi-product-item-dialog',
    templateUrl: './product-items-dialog.component.html'
})
export class ProductItemsDialogComponent implements OnInit {
    object: IProduct = {};
    colors?: IProductStyle[] = [];
    sizes?: IProductStyle[] = [];

    type = '';

  editForm = this.fb.group({
      id: [],
      items: this.fb.array([])
  });

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private uuidService: UuidService,
        private fb: FormBuilder,
        protected modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
//        this.object.items!.forEach(item => {
//            const productItem: IProductItem = Object.assign(new ProductItem(), item);
//            this.productItems.push(productItem);
//        });
        
        this.updateForm(this.object);
        this.colors = this.object.colors;
        this.sizes = this.object.sizes;
        if (!this.colors) {
            console.error('!this.colors');
            this.colors = [new ProductStyle()];
        } else if (this.colors.length === 0) {
            console.error('this.colors && this.colors.length === 0');
            this.colors = [new ProductStyle()];
        } 
        if (!this.sizes) {
            this.sizes = [new ProductStyle()];
        }else if (this.sizes.length === 0) {
            this.sizes = [new ProductStyle()];
        }
//        this.registerChangeInPrices();
//        this.registerChangeInQuantities();
    }
    
    updateForm(product: IProduct): void {
        this.editForm = this.fb.group({
                            id: product.id,
                            items: this.convertToFormItems(product.items)
                        });
        /**
        this.items.controls.forEach((itemFormGroup: AbstractControl) => {
            if (itemFormGroup.value){
                console.error('itemFormGroup.value.id: ' + itemFormGroup.value.id + ', itemFormGroup.value.prices: ' + itemFormGroup.value.prices); //  + ', ' + itemFormGroup.value.prices?Object.getOwnPropertyNames(itemFormGroup.value.prices):'');
                if (itemFormGroup.value.prices){
                    console.error('Object.getOwnPropertyNames(itemFormGroup.value.prices): ' + Object.getOwnPropertyNames(itemFormGroup.value.prices)); 
                }
            }
            
        });
        */
        
//        console.error('this.editForm.get(\'items\')![\'value\']: ' + this.editForm.get('items')!['value']);
//        console.error('Object.getOwnPropertyNames(this.editForm.get(\'items\')!.value): ' + Object.getOwnPropertyNames(this.editForm.get(['items'])!.value));
        
//        formArray.value.forEach((item: IProductItem) => {
//            console.error('item: ' + Object.getOwnPropertyNames(item));
//        });
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
        console.error('product-items-dialog->convertToFormItem->item.dirtyQuantities: ' + item.dirtyQuantities);
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
            prices: this.convertToFormPrices(item.prices),
            quantities: this.convertToFormQuantities(item.quantities),
            product: item.product,
            url: item.url,
            dirtyPrices: item.dirtyPrices,
            dirtyQuantities: item.dirtyQuantities,
            dirtyUrl: item.dirtyUrl
        });
    }
    
    convertToFormPrices(prices: IPrice[] | undefined): FormArray {
        const formArray: FormArray = this.fb.array([]);
        if (prices) {
            
            console.error('product-items-dialog->convertToFormPrices->Object.getOwnPropertyNames(productItem.prices): ' + Object.getOwnPropertyNames(prices));
            if (prices.length > 0){
                console.error('product-items-dialog->convertToFormPrices->productItem.prices.length: ' + prices.length);
                console.error('product-items-dialog->convertToFormPrices->Object.getOwnPropertyNames(productItem.prices[0]): ' + Object.getOwnPropertyNames(prices[0]));
            }
            
            prices.forEach((obj: IPrice) => {
                formArray.push(this.convertToFormPrice(obj));
            });
        }
        return formArray;
    }
    
    convertToFormPrice(obj: IPrice): FormGroup {
        console.error('product-items-dialog->convertToFormPrice->obj.from: ' + obj.from);
        console.error('product-items-dialog->convertToFormPrice->obj.to: ' + obj.to);
        return this.fb.group({
            id: obj.id,
            tempId: obj.tempId,
            from: obj.from ? ((obj.from instanceof moment)? obj.from: (moment(obj.from))) : null,
            to: obj.to ? ((obj.to instanceof moment)? obj.to: (moment(obj.to))) : null,
            price: obj.price,
            currency: obj.currency
        });
    }
    
    convertToFormQuantities(quantities: IQuantity[] | undefined): FormArray {
        const formArray: FormArray = this.fb.array([]);
        if (quantities) {            
            quantities.forEach((obj: IQuantity) => {
                formArray.push(this.convertToFormQuantity(obj));
            });
        }
        return formArray;
    }
    
    convertToFormQuantity(obj: IQuantity): FormGroup {
        return this.fb.group({
            id: obj.id,
            tempId: obj.tempId,
            from: obj.from ? ((obj.from instanceof moment)? obj.from: (moment(obj.from))) : null,
            to: obj.to ? ((obj.to instanceof moment)? obj.to: (moment(obj.to))) : null,
            quantity: obj.quantity
        });
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
        productItem.prices = itemFormGroup.value.prices; // FormArray will be treated as Object Array
        productItem.quantities = itemFormGroup.value.quantities;
        productItem.product = itemFormGroup.value.product;
        productItem.url = itemFormGroup.value.url;
        productItem.dirtyPrices = itemFormGroup.value.dirtyPrices;
        productItem.dirtyQuantities = itemFormGroup.value.dirtyQuantities;
        productItem.dirtyUrl = itemFormGroup.value.dirtyUrl;
        
        /**
        const prices = itemFormGroup.value.prices as FormArray;
//        console.error('product-items-dialog->convertFromFormItem->prices: ' + Object.getOwnPropertyNames(prices));
        
        if (prices && prices.controls) {
            console.error('product-items-dialog->convertFromFormItem->prices.controls: ' + prices.controls);
            console.error('product-items-dialog->convertFromFormItem->prices.controls.length: ' + prices.controls.length);
        }

        if (prices && prices.controls && prices.controls.length > 0) {
            console.error('product-items-dialog->convertFromFormItem->prices.controls: ' + Object.getOwnPropertyNames(prices.controls));
            productItem.prices = [];
            prices.controls.forEach((priceFormGroup: AbstractControl) => {
                productItem.prices!.push(this.convertFromFormPrice(priceFormGroup));
            });
        }
        console.error('product-items-dialog->convertFromFormItem->productItem.prices: ' + productItem.prices);
//        console.error('product-items-dialog->convertFromFormItem->Object.getOwnPropertyNames(productItem.prices): ' + Object.getOwnPropertyNames(productItem.prices));
        */
        return productItem;
    }
    
    // Not in use
    private convertFromFormPrice(priceFormGroup: AbstractControl): IPrice {
        const price: IPrice = new Price();
        price.id = priceFormGroup.value.id;
        price.tempId = priceFormGroup.value.tempId;
        price.from = priceFormGroup.value.from;
        price.to = priceFormGroup.value.to;
        price.price = priceFormGroup.value.price;
        price.currency = priceFormGroup.value.currency;
        price.item = priceFormGroup.value.item;
        return price;
    }
    
    get items() : FormArray {
        return this.editForm.get('items') as FormArray  // this.editForm.controls['items'] as FormArray
    }

//    registerChangeInPrices() {
//        this.eventSubscriber = this.eventManager.subscribe(
//            ProductItemsBroadcastName.PRICES, response => {
//                if (response.type === ProductItemsDialogType.SINGLE) {
//                    this.updatePrices(response.obj);
//                } else if (response.type === ProductItemsDialogType.ALL) {
//                    this.updatePricesForAll(response.obj);
//                }
//            }
//        );
//    }

//    registerChangeInQuantities() {
//        this.eventSubscriber = this.eventManager.subscribe(
//            ProductItemsBroadcastName.QUANTITIES, response => {
//                if (response.type === ProductItemsDialogType.SINGLE) {
//                    this.updateQuantities(response.obj);
//                } else if (response.type === ProductItemsDialogType.ALL) {
//                    this.updateQuantitiesForAll(response.obj);
//                }
//            }
//        );
//    }

    updatePrices(productItem: IProductItem): void {
        console.error('updatePrices');
        console.error('product-items-dialog->updatePrices->item.prices: ' + Object.getOwnPropertyNames(productItem.prices));
        
        const product: IProduct = this.createFromForm();
        product.items!.forEach((item) => {
            if (item.id && item.id === productItem.id || item.tempId && item.tempId === productItem.tempId) {
                console.error('product-items-dialog->updatePrices->item found.');
                item.prices = productItem.prices;
                item.dirtyPrices = true;
            }
        });
        this.updateForm(product);
        
        
        /**
        this.items.controls.forEach((itemFormGroup: AbstractControl) => {
            console.error('itemFormGroup.value.id: ' + itemFormGroup.value.id + ', productItem.id: ' + productItem.id + ', productItem.tempId: ' + productItem.tempId);
            if (itemFormGroup.value.id && itemFormGroup.value.id === productItem.id) {
                console.error('item found');
                let prices = itemFormGroup.value.prices as FormArray;
                console.error('product-items-dialog->updatePrices->prices: ' + Object.getOwnPropertyNames(prices));
                if (!prices){
                    console.error('product-items-dialog->updatePrices->!prices->beforeInitial');
                    prices = this.fb.array([]);
                    console.error('product-items-dialog->updatePrices->!prices->afterInitial');
                }
                console.error('product-items-dialog->updatePrices->!prices->beforeConvertToFormPrices');
                if (productItem.prices){
                    console.error('before patchValue');
                    prices = this.convertToFormPrices(productItem.prices);
                    console.error('after patchValue');
                }
                console.error('product-items-dialog->updatePrices->!prices->afterConvertToFormPrices');
//                itemFormGroup.value.prices = productItem.prices;
//                itemFormGroup.value.dirtyPrices = true;
                return;
            } else if (itemFormGroup.value.tempId && itemFormGroup.value.tempId === productItem.tempId) {
                console.error('item found');
                itemFormGroup.value.prices = productItem.prices;
                itemFormGroup.value.dirtyPrices = true;
                return;
            }
        });

        this.items.controls.forEach((itemFormGroup: AbstractControl) => {
            console.error('product-items-dialog->itemFormGroup.value.id: ' + itemFormGroup.value.id);
            console.error('product-items-dialog->itemFormGroup.value.price: ' + itemFormGroup.value.price);
            if (itemFormGroup.value.prices) {
                console.error('product-items-dialog->itemFormGroup.value.prices: ' + Object.getOwnPropertyNames(itemFormGroup.value.prices));
                if (itemFormGroup.value.prices.length > 0) {
                    console.error('product-items-dialog->itemFormGroup.value.prices[0]: ' + Object.getOwnPropertyNames(itemFormGroup.value.prices[0]));    
                }
            }
        });
        **/
    }

    updatePricesForAll(productItem: IProductItem): void {
        console.error('updatePricesForAll');
        this.editForm.get(['items'])!.value.forEach((item: IProductItem) => {
            if (item.id && item.id === productItem.id) {
                item.prices = productItem.prices;
            } else if (item.tempId && item.tempId === productItem.tempId) {
                item.prices = productItem.prices;
            } else {
                item.prices = [];
                productItem.prices!.forEach(price => {
                    const obj: IPrice = Object.assign(new Price(), price);
                    obj.id = undefined;
                    obj.tempId = this.uuidService.get();
                    item.prices!.push(obj);
                });
            }
            item.dirtyPrices = true;
        });
    }

    updateQuantities(productItem: IProductItem): void {        
        const product: IProduct = this.createFromForm();
        product.items!.forEach((item) => {
            if (item.id && item.id === productItem.id || item.tempId && item.tempId === productItem.tempId) {
                console.error('product-items-dialog->updateQuantities->item found.');
                item.quantities = productItem.quantities;
                item.dirtyQuantities = true;
            }
        });
        this.updateForm(product);
    }

    updateQuantitiesForAll(productItem: IProductItem): void {
        console.error('updateQuantitiesForAll');
        this.editForm.get(['items'])!.value.forEach((item: IProductItem) => {
            item.quantities = productItem.quantities;
        });
        this.editForm.get(['items'])!.value.forEach((item: IProductItem) => {
            if (item.id && item.id === productItem.id) {
                item.quantities = productItem.quantities;
            } else if (item.tempId && item.tempId === productItem.tempId) {
                console.error('else if');
                item.quantities = productItem.quantities;
            } else {
                item.quantities = [];
                productItem.quantities!.forEach(quantity => {
                    const obj: Quantity = Object.assign(new Quantity(), quantity);
                    obj.id = undefined;
                    obj.tempId = this.uuidService.get();
                    item.quantities!.push(obj);
                });
            }
            item.dirtyQuantities = true;
        });
    }

    clear(): void {
        this.activeModal.dismiss('cancel');
    }

    confirm(): void {
      this.activeModal.close(this.createFromForm());
    }

    editPrices(item: AbstractControl): void { // itemFormControl , AbstractControl       
//        this.popupService.open(PricesDialogComponent as Component, item, ProductItemsBroadcastName.PRICES);
        
//        const copyObj: ProductItem = Object.assign(new ProductItem(), item);
//        this.popupService.open(ProductItemsDialogComponent as Component, copyObj, ProductDetailBroadcastName.PRODUCT_ITEM, type);
        
        const modalRef: NgbModalRef = this.modalService.open(PricesDialogComponent, { size: 'lg', backdrop: 'static' });
        
        
//        const ifg = this.items.controls.filter((itemFormGroup: AbstractControl) => itemFormGroup.value.id === item.id)
//        item.prices = ifg[0].value.prices;
        /**
        console.error('product-item-dialog->editPrices->item.value.id: ' + item.value.id);
        console.error('product-item-dialog->editPrices->item.value.code: ' + item.value.code);
        console.error('product-item-dialog->editPrices->item: ' + Object.getOwnPropertyNames(item.value));
        if (item.value.prices) {
            console.error('product-item-dialog->editPrices->item.value.prices: ' + Object.getOwnPropertyNames(item.value.prices));
        }
        this.items.controls.forEach((itemFormGroup: AbstractControl) => {
            console.error('itemFormGroup.value.id: ' + itemFormGroup.value.id);
            console.error('itemFormGroup.value.price: ' + itemFormGroup.value.price);
            if (itemFormGroup.value.prices) {
                console.error('itemFormGroup.value.prices: ' + Object.getOwnPropertyNames(itemFormGroup.value.prices));
                if (itemFormGroup.value.prices.length > 0) {
                    console.error('itemFormGroup.value.prices[0]: ' + Object.getOwnPropertyNames(itemFormGroup.value.prices[0]));    
                }
            }
        });
        */
        
        modalRef.componentInstance.object = this.convertFromFormItem(item);

//        modalRef.componentInstance.type =  type;
        modalRef.result.then((result) => {
            if (result && result.type) {
                if (result.type === ModalResultType.SINGLE) {
                    this.updatePrices(result.obj);
                } else if (result.type === ModalResultType.ALL) {
                    this.updatePricesForAll(result.obj);
                }
            }
        }).catch(() => {});
    }

    editQuantities(item: AbstractControl): void {
        const modalRef: NgbModalRef = this.modalService.open(QuantitiesDialogComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.object = this.convertFromFormItem(item);
        modalRef.result.then((result) => {
            if (result && result.type) {
                if (result.type === ModalResultType.SINGLE) {
                    this.updateQuantities(result.obj);
                } else if (result.type === ModalResultType.ALL) {
                    this.updateQuantitiesForAll(result.obj);
                }
            }
        }).catch(() => {});
    }

    trackProductStyleById(index: number, item: IProductStyle): any {
        return item.id;
    }

    trackProductById(index: number, item: IProduct): any {
        return item.id;
    }
}

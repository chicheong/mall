import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, AbstractControl, FormGroup } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

// import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPrice, Price } from 'app/shared/model/price.model';
import { IProductItem, ProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from 'app/entities/product-item/product-item.service';

import { UuidService } from 'app/shared/random/uuid.service';
import { DATE_TIME_FORMAT } from "app/shared/constants/input.constants";
import { IModalResult, ModalResult } from "app/shared/model/modal-result.model";
import { ModalResultType } from "app/shared/model/enumerations/modal-result-type.model";

@Component({
    selector: 'jhi-price-dialog',
    templateUrl: './prices-dialog.component.html'
})
export class PricesDialogComponent implements OnInit {

    object: IProductItem = {};
//    productitems: IProductItem[];
//    broadcastName: string;
//    type: string; // Not in use

    editForm = this.fb.group({
        productItemId: [],
        productItemTempId: [],
        prices: this.fb.array([])
    });

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private productItemService: ProductItemService,
        private eventManager: JhiEventManager,
        private uuidService: UuidService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        console.error('this.object.id: ' + this.object.id);
        if (this.object){
            if (this.object.prices && this.object.prices.length > 0) {
                console.error('price-dialog->ngOnInit->this.updateForm ');
                this.updateForm(this.object);
            } else {
                console.error('price-dialog->ngOnInit->default a price');
                // default a price
                const price: Price = new Price();
                price.tempId = this.uuidService.get();
                this.object.prices!.push(price);
                this.updateForm(this.object);
            }
        }
    }

    updateForm(productItem: IProductItem): void {
//        console.error('price-dialog->updateForm->productItem.id: ' + productItem.id);
//        this.editForm.patchValue({
//            productItemId: productItem.id,
//            productItemTempId: productItem.tempId,
//        });
//        productItem.prices!.forEach((price: IPrice) => {
//            this.prices.push(this.updateFormPrice(price));
//        });
        console.error('prices-dialog->productItem: ' + Object.getOwnPropertyNames(productItem));
        console.error('productItem.prices: ' + productItem.prices);
        this.editForm = this.fb.group({
                            productItemId: productItem.id,
                            productItemTempId: productItem.tempId,
                            prices: this.convertToFormPrices(productItem.prices)
                        });
    }
    
    convertToFormPrices(prices: IPrice[] | undefined): FormArray {
        const formArray: FormArray = this.fb.array([]);
        if (prices) {           
            prices.forEach((obj: IPrice) => {
                formArray.push(this.convertToFormPrice(obj));
            });
        }
        return formArray;
    }
    
    convertToFormPrice(obj: IPrice): FormGroup {
        console.error('prices-dialog->convertToFormPrice->obj.from: ' + obj.from + ', instanceof: ' + (obj.from instanceof String));
        console.error('prices-dialog->convertToFormPrice->obj.to: ' + obj.to);
        return this.fb.group({
                    id: obj.id,
                    tempId: obj.tempId,
                    from: obj.from? obj.from.format(DATE_TIME_FORMAT) : null,
                    to: obj.to? obj.to.format(DATE_TIME_FORMAT) : null,
                    price: obj.price,
                    currency: obj.currency
                });
    }
    
    private createFromForm(): IProductItem {
        const productItem: IProductItem = new ProductItem();
        productItem.id = this.editForm.get(['productItemId'])!.value;
        productItem.tempId = this.editForm.get(['productItemTempId'])!.value;
        productItem.prices = [];
        
        this.prices.controls.forEach((priceFormGroup: AbstractControl) => {
            productItem.prices!.push(this.convertFromFormPrice(priceFormGroup));
        });
        console.error('prices-dialog->createFromForm->item.prices: ' + Object.getOwnPropertyNames(productItem.prices));
        return productItem;
//        return {
//          ...new ProductItem(),
//          id: this.editForm.get(['productItemId'])!.value,
//          tempId: this.editForm.get(['productItemTempId'])!.value,
//          prices: this.editForm.get(['prices'])!.value
//        };
    }
    
    private convertFromFormPrice(priceFormGroup: AbstractControl): IPrice {
        const price: IPrice = new Price();
        price.id = priceFormGroup.value.id;
        price.tempId = priceFormGroup.value.tempId;
        price.from = priceFormGroup.value.from? moment(priceFormGroup.value.from, DATE_TIME_FORMAT): undefined,
        price.to = priceFormGroup.value.to? moment(priceFormGroup.value.to, DATE_TIME_FORMAT): undefined,
        price.price = priceFormGroup.value.price;
        price.currency = priceFormGroup.value.currency;
        price.item = priceFormGroup.value.item;
        return price;
    }
    
    get prices() : FormArray {
        return this.editForm.get("prices") as FormArray
    }

    addFormPrice(): void {
		const price: Price = new Price();
        price.tempId = this.uuidService.get();
        this.prices.push(this.convertToFormPrice(price));
    }

    removePrice(i: number): void {
        this.prices.removeAt(i);
    }

    clear(): void {
        this.activeModal.dismiss('cancel');
    }

    confirm(): void {
        const result: IModalResult = Object.assign(new ModalResult());
        result.type = ModalResultType.SINGLE;
        result.obj = this.createFromForm();
        this.activeModal.close(result);
    }

    addAndCopyToAll(): void {
        const result: IModalResult = Object.assign(new ModalResult());
        result.type = ModalResultType.ALL;
        result.obj = this.createFromForm();
        this.activeModal.close(result);
    }
}

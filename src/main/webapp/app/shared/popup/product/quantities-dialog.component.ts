import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuantity, Quantity } from 'app/shared/model/quantity.model';
import { IProductItem, ProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from 'app/entities/product-item/product-item.service';

import { UuidService } from 'app/shared/random/uuid.service';
import { DATE_TIME_FORMAT } from "app/shared/constants/input.constants";
import { IModalResult, ModalResult } from "app/shared/model/modal-result.model";
import { ModalResultType } from "app/shared/model/enumerations/modal-result-type.model";

@Component({
    selector: 'jhi-quantity-dialog',
    templateUrl: './quantities-dialog.component.html'
})
export class QuantitiesDialogComponent implements OnInit {

    object: IProductItem = {};

    editForm = this.fb.group({
        productItemId: [],
        productItemTempId: [],
        quantities: this.fb.array([])
    });

    constructor(
        public activeModal: NgbActiveModal,
        private productItemService: ProductItemService,
        private uuidService: UuidService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        if (this.object){
            if (this.object.quantities && this.object.quantities.length > 0) {
                this.updateForm(this.object);
            } else {
                // default a price
                const quantity: Quantity = new Quantity();
                quantity.tempId = this.uuidService.get();
                this.object.quantities!.push(quantity);
                this.updateForm(this.object);
            }
        }
    }

    updateForm(productItem: IProductItem): void {
        this.editForm = this.fb.group({
            productItemId: productItem.id,
            productItemTempId: productItem.tempId,
            quantities: this.convertToFormQuantities(productItem.quantities)
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
                    from: obj.from? obj.from.format(DATE_TIME_FORMAT) : null,
                    to: obj.to? obj.to.format(DATE_TIME_FORMAT) : null,
                    quantity: obj.quantity
                });
    }

    private createFromForm(): IProductItem {        
        const productItem: IProductItem = new ProductItem();
        productItem.id = this.editForm.get(['productItemId'])!.value;
        productItem.tempId = this.editForm.get(['productItemTempId'])!.value;
        productItem.quantities = [];
        
        this.quantities.controls.forEach((quantityFormGroup: AbstractControl) => {
            productItem.quantities!.push(this.convertFromFormQuantity(quantityFormGroup));
        });
        return productItem;
    }
    
    private convertFromFormQuantity(quantityFormGroup: AbstractControl): IQuantity {
        const quantity: IQuantity = new Quantity();
        quantity.id = quantityFormGroup.value.id;
        quantity.tempId = quantityFormGroup.value.tempId;
        quantity.from = quantityFormGroup.value.from? moment(quantityFormGroup.value.from, DATE_TIME_FORMAT): undefined,
        quantity.to = quantityFormGroup.value.to? moment(quantityFormGroup.value.to, DATE_TIME_FORMAT): undefined,
        quantity.quantity = quantityFormGroup.value.quantity;
        quantity.item = quantityFormGroup.value.item;
        return quantity;
    }
    
    get quantities() : FormArray {
        return this.editForm.get("quantities") as FormArray
    }

    addFormQuantity(): void {
        const quantity: Quantity = new Quantity();
        quantity.tempId = this.uuidService.get();
        this.quantities.push(this.convertToFormQuantity(quantity));
    }

    removeQuantity(i: number): void {
        this.quantities.removeAt(i);
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

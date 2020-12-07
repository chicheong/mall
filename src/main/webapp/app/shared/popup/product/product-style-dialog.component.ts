import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductStyle, ProductStyle } from 'app/shared/model/product-style.model';
import { ModalResult, IModalResult } from "app/shared/model/modal-result.model";
import { ModalResultType } from "app/shared/model/enumerations/modal-result-type.model";

@Component({
    selector: 'jhi-product-style-dialog',
    templateUrl: './product-style-dialog.component.html'
})
export class ProductStyleDialogComponent implements OnInit {
    object: IProductStyle = {};
    isSaving = false;
    
    editForm = this.fb.group({
        id: [],
        tempId: [],
        name: [],
        code: [],
        isDefault: [],
        type: [],
        product: [],
        url: [],
        dirtyUrl: [],
        disabled: []
    });

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder
    ) {
    }
    
    ngOnInit(): void {
        this.updateForm(this.object);
    }
    
    updateForm(productStyle: IProductStyle): void {
        this.editForm.patchValue({
          id: productStyle.id,
          tempId: productStyle.tempId,
          name: productStyle.name,
          code: productStyle.code,
          isDefault: productStyle.isDefault,
          type: productStyle.type,
          product: productStyle.product,
          url: productStyle.url,
          dirtyUrl: productStyle.dirtyUrl,
          disabled: productStyle.disabled
        });
    }

    cancel(): void {
        this.activeModal.dismiss('cancel');
    }

    confirm(): void {
        this.isSaving = true;
//        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.object, type: ProductDetailComponentType.CONFIRM});
        const result: IModalResult = Object.assign(new ModalResult());
        result.type = ModalResultType.UPDATE;
        result.obj = this.createFromForm();
        
        console.error('product-style-dialog->confirm->result.obj.name: ' + result.obj.name);
        this.activeModal.close(result);
        this.isSaving = false;
    }

    delete(): void {
        this.isSaving = true;
//        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.object, type: ProductDetailComponentType.DELETE});
        const result: IModalResult = Object.assign(new ModalResult());
        result.type = ModalResultType.DELETE;
        result.obj = this.createFromForm();
        this.activeModal.close(result);
//        this.activeModal.close(null);
        this.isSaving = false;
    }
    
    private createFromForm(): IProductStyle {
        return {
          ...new ProductStyle(),
          id: this.editForm.get(['id'])!.value,
          tempId: this.editForm.get(['tempId'])!.value,
          name: this.editForm.get(['name'])!.value,
          code: this.editForm.get(['code'])!.value,
          isDefault: this.editForm.get(['isDefault'])!.value,
          type: this.editForm.get(['type'])!.value,
          product: this.editForm.get(['product'])!.value,
          url: this.editForm.get(['url'])!.value,
          dirtyUrl: this.editForm.get(['dirtyUrl'])!.value,
          disabled: this.editForm.get(['disabled'])!.value
        };
     }
}

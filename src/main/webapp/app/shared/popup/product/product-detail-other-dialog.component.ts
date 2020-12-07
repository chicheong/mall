import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import * as moment from 'moment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { FormBuilder, Validators } from '@angular/forms';

import { IProductItem } from 'app/shared/model/product-item.model';
import { IProductStyle } from 'app/shared/model/product-style.model';
import { IPrice } from 'app/shared/model/price.model';
import { IQuantity } from 'app/shared/model/quantity.model';
import { IProduct, Product } from 'app/shared/model/product.model';
import { DATE_TIME_FORMAT } from "app/shared/constants/input.constants";

// import { UuidService } from 'app/shared';

@Component({
    selector: 'jhi-product-detail-other-dialog',
    templateUrl: './product-detail-other-dialog.component.html'
})
export class ProductDetailOtherDialogComponent implements OnInit {

//    private eventSubscriber: Subscription;

    object: IProduct = {};
//    broadcastName: string;
//    type: string; // Not in use

    editForm = this.fb.group({
        id: [],
        name: [null, [Validators.required]],
        code: [],
        brand: [],
        description: [],
        content: [],
        remark: [],
        status: [],
        createdBy: [],
        createdDate: [],
        lastModifiedBy: [],
        lastModifiedDate: [],
        shopId: []
    });

    constructor(
        public activeModal: NgbActiveModal,
        // private pricesPopupService: PricesPopupService,
        // private quantitiesPopupService: QuantitiesPopupService,
        private jhiAlertService: JhiAlertService,
        private fb: FormBuilder
//        private uuidService: UuidService
    ) {
    }

    ngOnInit(): void {
        this.updateForm(this.object);
    }
    
    updateForm(product: IProduct): void {
        this.editForm.patchValue({
          id: product.id,
          name: product.name,
          code: product.code,
          brand: product.brand,
          description: product.description,
          content: product.content,
          remark: product.remark,
          status: product.status,
          createdBy: product.createdBy,
          createdDate: product.createdDate ? product.createdDate.format(DATE_TIME_FORMAT) : null,
          lastModifiedBy: product.lastModifiedBy,
          lastModifiedDate: product.lastModifiedDate ? product.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
          shopId: product.shopId
        });
      }
    
    private createFromForm(): IProduct {
        return {
          ...new Product(),
          id: this.editForm.get(['id'])!.value,
          name: this.editForm.get(['name'])!.value,
          code: this.editForm.get(['code'])!.value,
          brand: this.editForm.get(['brand'])!.value,
          description: this.editForm.get(['description'])!.value,
          content: this.editForm.get(['content'])!.value,
          remark: this.editForm.get(['remark'])!.value,
          status: this.editForm.get(['status'])!.value,
          createdBy: this.editForm.get(['createdBy'])!.value,
          createdDate: this.editForm.get(['createdDate'])!.value
            ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
            : undefined,
          lastModifiedBy: this.editForm.get(['lastModifiedBy'])!.value,
          lastModifiedDate: this.editForm.get(['lastModifiedDate'])!.value
            ? moment(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
            : undefined,
          shopId: this.editForm.get(['shopId'])!.value
        };
    }

    clear(): void {
        this.activeModal.dismiss('cancel');
    }

    confirm(): void {
//        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.object});
        this.activeModal.close(this.createFromForm());
    }
}

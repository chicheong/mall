import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProductStyle } from 'app/shared/model/product-style.model';
import { IProduct } from 'app/shared/model/product.model';
import { ProductStyleService } from 'app/entities/product-style/product-style.service';
import { ProductService, ProductDetailComponentType } from 'app/entities/product';

@Component({
    selector: 'jhi-product-style-dialog',
    templateUrl: './product-style-dialog.component.html'
})
export class ProductStyleDialogComponent implements OnInit {

    object: IProductStyle;
    isSaving: boolean;
    broadcastName: string;
    type: string; // Not in use

    products: IProduct[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private productStyleService: ProductStyleService,
        private productService: ProductService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.productService.query()
            .subscribe((res: HttpResponse<IProduct[]>) => { this.products = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirm() {
        this.isSaving = true;
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.object, type: ProductDetailComponentType.CONFIRM});
        this.isSaving = false;
        this.activeModal.dismiss(this.object);
    }

    delete() {
        this.isSaving = true;
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.object, type: ProductDetailComponentType.DELETE});
        this.isSaving = false;
        this.activeModal.dismiss(this.object);
    }

    save() {
        this.isSaving = true;
        if (this.object.id !== undefined) {
            this.subscribeToSaveResponse(
                this.productStyleService.update(this.object));
        } else {
            this.subscribeToSaveResponse(
                this.productStyleService.create(this.object));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IProductStyle>>) {
        result.subscribe((res: HttpResponse<IProductStyle>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: IProductStyle) {
        this.eventManager.broadcast({ name: 'productStyleListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackProductById(index: number, item: IProduct) {
        return item.id;
    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { JhiEventManager, JhiAlertService  } from 'ng-jhipster';

import { Product } from './product.model';
import { ProductService } from './product.service';

@Component({
    selector: 'jhi-product-detail',
    templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit, OnDestroy {

    product: Product;
    isSaving: boolean;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    isEditing = false;

    constructor(
        private eventManager: JhiEventManager,
        private productService: ProductService,
        private route: ActivatedRoute,
        private alertService: JhiAlertService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInProducts();
    }

    load(id) {
        this.productService.find(id).subscribe((product) => {
            this.product = product;
            if (!product.id) {
                this.isEditing = true;
            }
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInProducts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'productListModification',
            (response) => this.load(this.product.id)
        );
    }

    save() {
        this.isSaving = true;
        if (this.product.id) { // !== undefined
            console.error('update');
            this.subscribeToSaveResponse(
                this.productService.update(this.product));
        } else {
            console.error('create');
            this.subscribeToSaveResponse(
                this.productService.create(this.product));
        }
    }

    private subscribeToSaveResponse(result: Observable<Product>) {
        result.subscribe((res: Product) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Product) {
        this.eventManager.broadcast({ name: 'productListModification', content: 'OK'});
        this.isSaving = false;
        this.isEditing = false;
      console.error('result.id=' + result.id);
        setTimeout(this.router.navigate(['/product', result.id]), 0);
        // this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    edit() {
        this.isEditing = true;
    }

    cancel() {
        this.isEditing = false;
        this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }
}

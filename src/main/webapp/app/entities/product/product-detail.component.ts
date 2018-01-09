import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { JhiEventManager, JhiAlertService  } from 'ng-jhipster';

import { Product } from './product.model';
import { ProductService } from './product.service';
import { Principal } from '../../shared';

import { ProductItem } from './../product-item';
import { ProductStyle, ProductStyleType } from './../product-style';

import { ProductStylePopupService } from './../product-style/product-style-popup.service';
import { ProductStyleDialogComponent } from './../product-style/product-style-dialog.component';
import { ProductItemsPopupService } from './product-items-popup.service';
import { ProductItemsDialogComponent } from './product-items-dialog.component';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-product-detail',
    templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit, OnDestroy {

    product: Product;
    isSaving: boolean;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    isEditing: boolean;

    constructor(
        private eventManager: JhiEventManager,
        private productService: ProductService,
        private productStylePopupService: ProductStylePopupService,
        private productItemsPopupService: ProductItemsPopupService,
        private route: ActivatedRoute,
        private jhiAlertService: JhiAlertService,
        private router: Router,
        private principal: Principal
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.isEditing = false;
        this.subscription = this.route.params.subscribe((params) => {
            if ((params['id'])) {
                if ((params['id']) === 'new') {
                    const entity: Product = Object.assign(new Product());
                    // If no shopId provided, get from user account
                    this.principal.identity().then((account) => {
                        entity.shopId = account.shopId;
                    });
                    this.product = entity;
                    this.initObjects();
                    this.isEditing = true;
                } else {
                    this.load(params['id']);
                }
            } else if ((params['shopId'])) {
                const entity: Product = Object.assign(new Product());
                entity.shopId = (params['shopId']);
                this.product = entity;
                this.initObjects();
                this.isEditing = true;
            } else {

            }
        });
        this.registerChangeInProducts();
        this.registerChangeInProductStyle();
    }

    initObjects() {
        const color: ProductStyle = Object.assign(new ProductStyle());
        color.id = this.uuid();
        color.type = ProductStyleType.COLOR;
        color.name = 'D';
        const size: ProductStyle = Object.assign(new ProductStyle());
        size.id = this.uuid();
        size.type = ProductStyleType.SIZE;
        size.name = 'D';
        this.product.colors = [color];
        this.product.sizes = [size];
        const item: ProductItem = Object.assign(new ProductItem());
        item.color = color;
        item.size = size;
        this.product.items = [item];
    }

    load(id) {
        this.productService.find(id).subscribe((product) => {
            this.product = product;
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

    registerChangeInProductStyle() {
        this.eventSubscriber = this.eventManager.subscribe(
            'productStyleModification',
            (response) => this.updateStyle(response.obj)
        );
    }

    updateStyle(productStyle: ProductStyle) {
        let index: number;
        if (productStyle.type === ProductStyleType.COLOR) {
            this.product.colors.forEach((color) => {
                if (color.id === productStyle.id) {
                    console.error('color found');
                    index = this.product.colors.indexOf(color);
                    this.product.colors[index] = productStyle;
                    return;
                }
            })
            if (index === undefined) {
                this.product.colors.push(productStyle);
                let item: ProductItem;
                this.product.sizes.forEach((size) => {
                    item = Object.assign(new ProductItem());
                    item.color = productStyle;
                    item.size = size;
                    this.product.items.push(item);
                });
            }
        } else if (productStyle.type === ProductStyleType.SIZE) {
            this.product.sizes.forEach((size) => {
                if (size.id === productStyle.id) {
                    index = this.product.sizes.indexOf(size);
                    this.product.sizes[index] = productStyle;
                    return;
                }
            })
            if (index === undefined) {
                this.product.sizes.push(productStyle);
                let item: ProductItem;
                this.product.colors.forEach((color) => {
                    item = Object.assign(new ProductItem());
                    item.color = color;
                    item.size = productStyle;
                    this.product.items.push(item);
                });
            }
        }
    }

    save() {
        this.isSaving = true;
        if (this.product.id) { // !== undefined
            console.error('update: ' + this.product.id);
            this.subscribeToSaveResponse(
                this.productService.update(this.product));
        } else {
            console.error('create: ' + this.product.id);
            this.subscribeToSaveResponse(
                this.productService.create(this.product));
        }
    }

    private subscribeToSaveResponse(result: Observable<Product>) {
        result.subscribe((res: Product) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Product) {
        // this.eventManager.broadcast({ name: 'productListModification', content: 'OK'});
        this.isSaving = false;
        this.isEditing = false;
        console.error('result.id=' + result.id);
        this.router.navigate(['/product', result.id]);
        this.product = result;
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
        this.jhiAlertService.error(error.message, null, null);
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

    addColor() {
        const obj: ProductStyle = Object.assign(new ProductStyle());
        obj.id = this.uuid();
        obj.type = ProductStyleType.COLOR;
        this.editStyle(obj);
    }

    addSize() {
        const obj: ProductStyle = Object.assign(new ProductStyle());
        obj.id = this.uuid();
        obj.type = ProductStyleType.SIZE;
        this.editStyle(obj);
    }

    editStyle(obj: ProductStyle) {
        const copyObj: ProductStyle = Object.assign(new ProductStyle(), obj);
        this.productStylePopupService.open(ProductStyleDialogComponent as Component, copyObj);
    }

    editItems(objects: ProductItem[]) {
        this.productItemsPopupService.open(ProductItemsDialogComponent as Component, objects);
    }

    private uuid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
}

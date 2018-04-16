import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager, JhiAlertService  } from 'ng-jhipster';

import { Product } from './product.model';
import { ProductService } from './product.service';
import { LoginModalService, Principal, UuidService } from '../../shared';

import { ProductItem, CurrencyType } from './../product-item';
import { ProductStyle, ProductStyleType, ProductStylePopupService, ProductStyleDialogComponent } from './../product-style';

import { ProductItemsPopupService } from './product-items-popup.service';
import { ProductItemsDialogComponent, ProductItemsDialogType } from './product-items-dialog.component';
import { FileUploadPopupService } from './file-upload-popup.service';
import { FileUploadDialogComponent } from './file-upload-dialog.component';

import { MyOrderService, MyOrder } from './../my-order';
import { Url, UrlPopupService, UrlDeleteDialogComponent } from './../url';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { SortEvent } from './../../shared/draggable/sortable-list.directive';

export const enum ProductDetailComponentType {
    CONFIRM = 'CONFIRM',
    DELETE = 'DELETE',
}
@Component({
    selector: 'jhi-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: [
        'product-detail.scss'
    ]
})
export class ProductDetailComponent implements OnInit, OnDestroy {

    product: Product;
    isSaving: boolean;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    isEditing: boolean;
    isSorted: boolean;
    selectedColor: ProductStyle = {};
    selectedSize: ProductStyle = {};
    selectedItem: ProductItem = {};
    selectedUrl: Url;

    modalRef: NgbModalRef;

    constructor(
        private eventManager: JhiEventManager,
        private productService: ProductService,
        private productStylePopupService: ProductStylePopupService,
        private productItemsPopupService: ProductItemsPopupService,
        private uploadMediaPopupService: FileUploadPopupService,
        private urlPopupService: UrlPopupService,
        private route: ActivatedRoute,
        private jhiAlertService: JhiAlertService,
        private router: Router,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private myOrderService: MyOrderService,
        private uuidService: UuidService,
    ) {
    }

    ngOnInit() {
        console.error('ngOnInit');
        this.isSaving = false;
        this.isEditing = false;
        this.isSorted = false;
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
        this.registerChangeInProductItems();
        this.registerAuthenticationSuccess();
        this.registerChangeInFiles();
        this.registerDeleteUrl();
    }

    initObjects() {
        this.product.urls = [];
        const color: ProductStyle = Object.assign(new ProductStyle());
        color.tempId = this.uuidService.get();
        color.type = ProductStyleType.COLOR;
        color.name = 'D';
        color.isDefault = true;
        const size: ProductStyle = Object.assign(new ProductStyle());
        size.tempId = this.uuidService.get();
        size.type = ProductStyleType.SIZE;
        size.name = 'D';
        size.isDefault = true;
        const color1: ProductStyle = Object.assign(new ProductStyle());
        color1.tempId = this.uuidService.get();
        color1.type = ProductStyleType.COLOR;
        color1.name = 'E';
        const size1: ProductStyle = Object.assign(new ProductStyle());
        size1.tempId = this.uuidService.get();
        size1.type = ProductStyleType.SIZE;
        size1.name = 'F';

        this.product.colors = [color, color1];
        this.product.sizes = [size, size1];
        const item: ProductItem = Object.assign(new ProductItem());
        item.tempId = this.uuidService.get();
        item.color = color;
        item.size = size;
        item.quantity = 1;
        item.currency = CurrencyType.HKD;
        const item1: ProductItem = Object.assign(new ProductItem());
        item1.tempId = this.uuidService.get();
        item1.color = color;
        item1.size = size1;
        item1.quantity = 1;
        item1.currency = CurrencyType.HKD;
        const item2: ProductItem = Object.assign(new ProductItem());
        item2.tempId = this.uuidService.get();
        item2.color = color1;
        item2.size = size;
        item2.quantity = 1;
        item2.currency = CurrencyType.HKD;
        const item3: ProductItem = Object.assign(new ProductItem());
        item3.tempId = this.uuidService.get();
        item3.color = color1;
        item3.size = size1;
        item3.quantity = 1;
        item3.currency = CurrencyType.HKD;
        this.product.items = [item, item1, item2, item3];
    }

    load(id) {
        this.productService.find(id)
            .subscribe((productResponse: HttpResponse<Product>) => {
                this.product = productResponse.body;
                this.resetSelectedUrl();
            });
        this.selectedColor = {};
        this.selectedSize = {};
        this.selectedItem = {};
        this.isSorted = false;
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

    registerChangeInProductItems() {
        this.eventSubscriber = this.eventManager.subscribe(
            'productItemsModification',
            (response) => this.updateItems(response.obj)
        );
    }

    registerChangeInProductStyle() {
        this.eventSubscriber = this.eventManager.subscribe(
            'productStyleModification',
            (response) => {
                if (response.type === ProductDetailComponentType.CONFIRM) {
                    this.updateStyle(response.obj);
                } else if (response.type === ProductDetailComponentType.DELETE) {
                    this.deleteStyle(response.obj);
                }
            }
        );
    }

    registerChangeInFiles() {
        this.eventSubscriber = this.eventManager.subscribe(
            'filesModification',
            (response) => this.updateFiles(response.obj)
        );
    }

    registerDeleteUrl() {
        this.eventSubscriber = this.eventManager.subscribe(
            'deleteUrlModification',
            (response) => this.deleteUrl(response.obj)
        );
    }

    updateItems(product: Product) {
        let index: number;
        this.product.items.forEach((oProductItem) => {
            product.items.forEach((nProductItem) => {
                if (oProductItem.id && oProductItem.id === nProductItem.id) {
                    index = this.product.items.indexOf(oProductItem);
                    this.product.items[index] = nProductItem;
                    return;
                } else if (oProductItem.tempId && oProductItem.tempId === nProductItem.tempId) {
                    index = this.product.items.indexOf(oProductItem);
                    this.product.items[index] = nProductItem;
                    return;
                }
            });
        });
    }

    updateStyle(productStyle: ProductStyle) {
        let index: number;
        if (productStyle.type === ProductStyleType.COLOR) {
            this.product.colors.forEach((color) => {
                if (color.id && color.id === productStyle.id) {
                    console.error('color found');
                    index = this.product.colors.indexOf(color);
                    this.product.colors[index] = productStyle;
                    return;
                } else if (color.tempId && color.tempId === productStyle.tempId) {
                    console.error('color found');
                    index = this.product.colors.indexOf(color);
                    this.product.colors[index] = productStyle;
                    return;
                }
            });
            if (index === undefined) {
                this.product.colors.push(productStyle);
                let item: ProductItem;
                this.product.sizes.forEach((size) => {
                    item = Object.assign(new ProductItem());
                    item.tempId = this.uuidService.get();
                    item.color = productStyle;
                    item.size = size;
                    item.quantity = 1;
                    item.currency = CurrencyType.HKD;
                    this.product.items.push(item);
                });
            }
        } else if (productStyle.type === ProductStyleType.SIZE) {
            this.product.sizes.forEach((size) => {
                if (size.id && size.id === productStyle.id) {
                    index = this.product.sizes.indexOf(size);
                    this.product.sizes[index] = productStyle;
                    return;
                } else if (size.tempId && size.tempId === productStyle.tempId) {
                    index = this.product.sizes.indexOf(size);
                    this.product.sizes[index] = productStyle;
                    return;
                }
            });
            if (index === undefined) {
                this.product.sizes.push(productStyle);
                let item: ProductItem;
                this.product.colors.forEach((color) => {
                    item = Object.assign(new ProductItem());
                    item.tempId = this.uuidService.get();
                    item.color = color;
                    item.size = productStyle;
                    item.quantity = 1;
                    item.currency = CurrencyType.HKD;
                    this.product.items.push(item);
                });
            }
        }
    }

    deleteStyle(productStyle: ProductStyle) {
        let index: number;
        if (productStyle.type === ProductStyleType.COLOR) {
            this.product.colors.forEach((color) => {
                if (color.id && color.id === productStyle.id) {
                    index = this.product.colors.indexOf(color);
                    this.product.colors.splice(index, 1);
                    return;
                } else if (color.tempId && color.tempId === productStyle.tempId) {
                    index = this.product.colors.indexOf(color);
                    this.product.colors.splice(index, 1);
                    return;
                }
            });
        } else if (productStyle.type === ProductStyleType.SIZE) {
            this.product.sizes.forEach((size) => {
                if (size.id && size.id === productStyle.id) {
                    index = this.product.sizes.indexOf(size);
                    this.product.colors.splice(index, 1);
                    return;
                } else if (size.tempId && size.tempId === productStyle.tempId) {
                    index = this.product.sizes.indexOf(size);
                    this.product.colors.splice(index, 1);
                    return;
                }
            });
        }
        this.deleteItems(productStyle);
    }

    deleteItems(productStyle: ProductStyle) {
        const productItems: ProductItem[] = [];
        if (productStyle.type === ProductStyleType.COLOR) {
            this.product.items.forEach((item) => {
                if (item.color.id && item.color.id === productStyle.id) {
                    productItems.push(item);
                } else if (item.color.tempId && item.color.tempId === productStyle.tempId) {
                    productItems.push(item);
                }
            });
        } else if (productStyle.type === ProductStyleType.SIZE) {
            this.product.items.forEach((item) => {
                if (item.size.id && item.size.id === productStyle.id) {
                    productItems.push(item);
                } else if (item.size.tempId && item.size.tempId === productStyle.tempId) {
                    productItems.push(item);
                }
            });
        }
        this.product.items = this.product.items.filter((item) => productItems.indexOf(item) === -1);
    }

    updateFiles(urls: Url[]) {
        urls.forEach((url) => {
            this.product.urls.push(url);
        });
        this.resetSelectedUrl();
    }

    deleteUrl(nUrl: Url) {
        for (let i = 0; i < this.product.urls.length; i++) {
            const url = this.product.urls[i];
            if (nUrl.id && url.id === nUrl.id) {
                this.product.urls.splice(i, 1);
                break;
            } else if (url.path === nUrl.path) {
                this.product.urls.splice(i, 1);
                break;
            }
        }
        this.resetSelectedUrl();
    }

    save() {
        this.isSaving = true;
        if (this.isSorted) {
            this.product.urls.forEach((url) => {
                console.error('url.sequence: ' + url.sequence + ',url.fileName: ' + url.fileName);
            });
            for (let i = 0; i < this.product.urls.length; i++) {
                this.product.urls[i].sequence = i + 1;
                console.error('url.sequence: ' + this.product.urls[i].sequence + ',url.fileName: ' + this.product.urls[i].fileName);
            }
        }
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

    private subscribeToSaveResponse(result: Observable<HttpResponse<Product>>) {
        console.error('step0');
        result.subscribe((res: HttpResponse<Product>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Product) {
        // this.eventManager.broadcast({ name: 'productListModification', content: 'OK'});
        this.isSaving = false;
        this.isEditing = false;
        console.error('result.id=' + result.id);
        this.router.navigate(['/product', result.id]);
        this.product = result;
        this.resetSelectedUrl();
        // this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
        // this.onError(error);
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    edit() {
        this.isEditing = true;
        this.selectedItem = {};
        this.selectedColor = {};
        this.selectedSize = {};
    }

    cancel() {
        this.isEditing = false;
        this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    addColor() {
        const obj: ProductStyle = Object.assign(new ProductStyle());
        obj.tempId = this.uuidService.get();
        obj.type = ProductStyleType.COLOR;
        this.editStyle(obj);
    }

    addSize() {
        const obj: ProductStyle = Object.assign(new ProductStyle());
        obj.tempId = this.uuidService.get();
        obj.type = ProductStyleType.SIZE;
        this.editStyle(obj);
    }

    editStyle(obj: ProductStyle) {
        const copyObj: ProductStyle = Object.assign(new ProductStyle(), obj);
        this.productStylePopupService.open(ProductStyleDialogComponent as Component, copyObj);
    }

    editItems(type: ProductItemsDialogType) {
        const copyObj: Product = Object.assign(new Product(), this.product);
        this.productItemsPopupService.open(ProductItemsDialogComponent as Component, copyObj, type);
    }

    changeStyle(productStyle: ProductStyle) {
        if (productStyle.type === ProductStyleType.COLOR) {
            if (this.selectedColor === productStyle) {
                this.selectedColor = {};
            } else {
                this.selectedColor = productStyle;
            }
        } else if (productStyle.type === ProductStyleType.SIZE) {
            if (this.selectedSize === productStyle) {
                this.selectedSize = {};
            } else {
                this.selectedSize = productStyle;
            }
        }
        console.error('selectedColor: ' + this.selectedColor.name);
        console.error('selectedSize: ' + this.selectedSize.name);
        this.updateSelectedItem();
    }

    updateSelectedItem() {
        if (this.selectedColor.id && this.selectedSize.id) {
            this.selectedItem = this.product.items.find((item) => item.color.id === this.selectedColor.id && item.size.id === this.selectedSize.id);
            this.product.items.filter((item) => item.color.id === this.selectedColor.id).forEach((item) => {
                if (item.quantity <= 0) {
                    this.product.sizes.find((size) => size.id === item.size.id).disabled = true;
                } else {
                    this.product.sizes.find((size) => size.id === item.size.id).disabled = false;
                }
            });
            this.product.items.filter((item) => item.size.id === this.selectedSize.id).forEach((item) => {
                if (item.quantity <= 0) {
                    this.product.colors.find((color) => color.id === item.color.id).disabled = true;
                } else {
                    this.product.colors.find((color) => color.id === item.color.id).disabled = false;
                }
            });
        } else if (this.selectedColor.id) {
            this.selectedItem = {};
            this.product.items.filter((item) => item.color.id === this.selectedColor.id).forEach((item) => {
                if (item.quantity <= 0) {
                    this.product.sizes.find((size) => size.id === item.size.id).disabled = true;
                } else {
                    this.product.sizes.find((size) => size.id === item.size.id).disabled = false;
                }
            });
        } else if (this.selectedSize.id) {
            this.selectedItem = {};
            this.product.items.filter((item) => item.size.id === this.selectedSize.id).forEach((item) => {
                if (item.quantity <= 0) {
                    this.product.colors.find((color) => color.id === item.color.id).disabled = true;
                } else {
                    this.product.colors.find((color) => color.id === item.color.id).disabled = false;
                }
            });
        } else {
            this.selectedItem = {};
            this.product.colors.forEach((color) => color.disabled = false);
            this.product.sizes.forEach((size) => size.disabled = false);
        }
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                console.error('Product Detail registerAuthenticationSuccess');
//                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    addToCart() {
        if (this.isAuthenticated()) {
            this.subscribeToAddToCartResponse(
                    this.myOrderService.addToCart(this.selectedItem, 1));
        } else {
            this.login();
        }
    }

    private subscribeToAddToCartResponse(result: Observable<HttpResponse<MyOrder>>) {
        result.subscribe((res: HttpResponse<MyOrder>) =>
            this.onAddToCartSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onAddToCartSuccess(result: MyOrder) {
        // this.eventManager.broadcast({ name: 'productListModification', content: 'OK'});
        this.isSaving = false;
        this.isEditing = false;
        console.error('result.id=' + result.id);
    }

    uploadMedia() {
        const copyObj: Product = Object.assign(new Product(), this.product);
        this.uploadMediaPopupService.open(FileUploadDialogComponent as Component, copyObj);
    }

    deleteMedia(url: Url) {
        const copyObj: Url = Object.assign(new Url(), url);
        this.urlPopupService.open(UrlDeleteDialogComponent as Component, copyObj);
    }

    selectUrl(nUrl: Url) {
        for (let i = 0; i < this.product.urls.length; i++) {
            const url = this.product.urls[i];
            if (nUrl.id && url.id === nUrl.id) {
                this.selectedUrl = url;
                break;
            } else if (url.path === nUrl.path) {
                this.selectedUrl = url;
                break;
            }
        }
    }

    resetSelectedUrl() {
        if (this.product.urls && this.product.urls[0]) {
            this.product.urls.filter((url) => url.sequence === 1).map((url) => {
                this.selectedUrl = url;
            });
        } else {
            this.selectedUrl = {};
        }
    }

    sort(event: SortEvent) {
        const url: Url = this.product.urls[event.currentIndex];
        this.product.urls.splice(event.currentIndex, 1);
        this.product.urls.splice(event.newIndex, 0, url);
        this.isSorted = true;
    }
}

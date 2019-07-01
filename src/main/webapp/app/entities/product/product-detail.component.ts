import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';
import { JhiEventManager, JhiAlertService  } from 'ng-jhipster';

import { IProduct, Product } from 'app/shared/model/product.model';
import { ProductService } from './product.service';
import { UuidService, FileUploadModelService, PermissionService, PopupService, ProductDetailOtherDialogComponent, ProductItemsDialogComponent, ProductItemsDialogType, ProductItemsUrlDialogComponent, ProductStyleDialogComponent } from 'app/shared';
import { LoginModalService } from 'app/core';
import { AccountService } from 'app/core';

import { IProductItem, ProductItem } from 'app/shared/model/product-item.model';
import { IProductStyle, ProductStyle, ProductStyleType } from 'app/shared/model/product-style.model';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order/my-order.service';
import { IUrl, Url } from 'app/shared/model/url.model';
import { UrlPopupService } from 'app/entities/url/url-popup.service';
import { UrlDeleteDialogComponent } from 'app/entities/url/url-delete-dialog.component';

import { CurrencyType } from 'app/shared/model/price.model';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { SortEvent } from 'app/shared/draggable/sortable-list.directive';

import { AngularEditorConfig } from '@kolkov/angular-editor';

export const enum ProductDetailComponentType {
    CONFIRM = 'CONFIRM',
    DELETE = 'DELETE',
}
export const enum ProductDetailBroadcastName {
    PRODUCT_LIST = 'productListModification',
    PRODUCT_ITEM = 'productItemsModification',
    PRODUCT_STYLE = 'productStyleModification',
    PRODUCT_FILE = 'productFileModification',
    DELETE_URL = 'deleteUrlModification',
    PRODUCT_DETAIL_OTHER = 'productDetailOtherModification',
    PRODUCT_ITEMS_URL = 'productItemsUrlModification'
}
@Component({
    selector: 'jhi-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: [
        'product-detail.scss'
    ]
})
export class ProductDetailComponent implements OnInit {
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    product: IProduct;
    isSaving: boolean;
    isEditing: boolean;
    isSorted: boolean;
    selectedColor: IProductStyle = {};
    selectedSize: IProductStyle = {};
    selectedItem: IProductItem = {};
    selectedUrl: IUrl;
    selectedCurrency: string;
    priceRange: string;
    isEditable: boolean;

    modalRef: NgbModalRef;

    config: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '30rem',
        minHeight: '5rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        customClasses: [
          {
            name: 'quote',
            class: 'quote',
          },
          {
            name: 'redText',
            class: 'redText'
          },
          {
            name: 'titleText',
            class: 'titleText',
            tag: 'h1',
          },
       ]
    };

    constructor(
        protected activatedRoute: ActivatedRoute,
        private eventManager: JhiEventManager,
        private productService: ProductService,
        // private productDetailPopupService: ProductDetailPopupService,
        private popupService: PopupService,
        private fileUploadModelService: FileUploadModelService,
        private urlPopupService: UrlPopupService,
        private route: ActivatedRoute,
        private jhiAlertService: JhiAlertService,
        private router: Router,
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private myOrderService: MyOrderService,
        private permissionService: PermissionService,
        private uuidService: UuidService
    ) {}

    ngOnInit() {
        console.error('ngOnInit');
        this.isSaving = false;
        this.isEditing = false;
        this.isSorted = false;
        this.isEditable = false;
        this.activatedRoute.data.subscribe(({ product }) => {
            this.product = product;
        });
        this.subscription = this.route.params.subscribe(params => {
            if ((params['id'])) {
                if ((params['id']) === 'new') {
                    const entity: Product = Object.assign(new Product());
                    // If no shopId provided, get from user account
                    this.accountService.identity().then(account => {
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
                // Not consider ATM
            }
            this.initCurrencyAndPrice();
        });
        this.registerChangeInProducts();
        this.registerChangeInProductStyle();
        this.registerChangeInProductItems();
        this.registerAuthenticationSuccess();
        this.registerChangeInProductUrls();
        this.registerDeleteUrl();
        this.registerChangeInDetailOther();
        this.registerChangeInItemsUrl();
    }

    initObjects() {
        console.error('this.selectedCurrency: ' + this.selectedCurrency);
        this.product.urls = [];
        const color: IProductStyle = Object.assign(new ProductStyle());
        color.tempId = this.uuidService.get();
        color.type = ProductStyleType.COLOR;
        color.name = 'D';
        color.isDefault = true;
        const size: IProductStyle = Object.assign(new ProductStyle());
        size.tempId = this.uuidService.get();
        size.type = ProductStyleType.SIZE;
        size.name = 'D';
        size.isDefault = true;
        const color1: IProductStyle = Object.assign(new ProductStyle());
        color1.tempId = this.uuidService.get();
        color1.type = ProductStyleType.COLOR;
        color1.name = 'E';
        const size1: IProductStyle = Object.assign(new ProductStyle());
        size1.tempId = this.uuidService.get();
        size1.type = ProductStyleType.SIZE;
        size1.name = 'F';

        this.product.colors = [color, color1];
        this.product.sizes = [size, size1];
        const item: IProductItem = Object.assign(new ProductItem());
        item.tempId = this.uuidService.get();
        item.color = color;
        item.size = size;
        item.quantity = 1;
        item.currency = CurrencyType.HKD;
        const item1: IProductItem = Object.assign(new ProductItem());
        item1.tempId = this.uuidService.get();
        item1.color = color;
        item1.size = size1;
        item1.quantity = 1;
        item1.currency = CurrencyType.HKD;
        const item2: IProductItem = Object.assign(new ProductItem());
        item2.tempId = this.uuidService.get();
        item2.color = color1;
        item2.size = size;
        item2.quantity = 1;
        item2.currency = CurrencyType.HKD;
        const item3: IProductItem = Object.assign(new ProductItem());
        item3.tempId = this.uuidService.get();
        item3.color = color1;
        item3.size = size1;
        item3.quantity = 1;
        item3.currency = CurrencyType.HKD;
        this.product.items = [item, item1, item2, item3];
    }

    initCurrencyAndPrice() {
        // TODO: Currency from User Info or Product Items
        this.selectedCurrency = CurrencyType.HKD + '$';

        const len = this.product.items.length;
        let min = Infinity, max = -Infinity;
        this.product.items.forEach(item => {
            if (item && item.price) {
                if (item.price < min) {
                    min = item.price;
                }
                if (item.price > max) {
                    max = item.price;
                }
            }
        });
        this.priceRange = min + ' - ' + max;
    }

    load(id) {
        this.productService.find(id)
            .subscribe((productResponse: HttpResponse<IProduct>) => {
                this.product = productResponse.body;
                this.assignPermission(this.product.permission);
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

    onDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInProducts() {
        this.eventSubscriber = this.eventManager.subscribe(
            ProductDetailBroadcastName.PRODUCT_LIST,
            response => this.load(this.product.id)
        );
    }

    registerChangeInProductItems() {
        this.eventSubscriber = this.eventManager.subscribe(
            ProductDetailBroadcastName.PRODUCT_ITEM,
            response => this.updateItems(response.obj)
        );
    }

    registerChangeInProductStyle() {
        this.eventSubscriber = this.eventManager.subscribe(
            ProductDetailBroadcastName.PRODUCT_STYLE,
            response => {
                if (response.type === ProductDetailComponentType.CONFIRM) {
                    this.updateStyle(response.obj);
                } else if (response.type === ProductDetailComponentType.DELETE) {
                    this.deleteStyle(response.obj);
                }
            }
        );
    }

    registerChangeInProductUrls() {
        this.eventSubscriber = this.eventManager.subscribe(
            ProductDetailBroadcastName.PRODUCT_FILE,
            response => this.updateProductUrls(response.obj)
        );
    }

    registerDeleteUrl() {
        this.eventSubscriber = this.eventManager.subscribe(
            ProductDetailBroadcastName.DELETE_URL,
            response => this.deleteUrl(response.obj)
        );
    }

    registerChangeInDetailOther() {
        this.eventSubscriber = this.eventManager.subscribe(
            ProductDetailBroadcastName.PRODUCT_DETAIL_OTHER,
            response => this.updateDetailOther(response.obj)
        );
    }

    registerChangeInItemsUrl() {
        this.eventSubscriber = this.eventManager.subscribe(
            ProductDetailBroadcastName.PRODUCT_ITEMS_URL,
            response => this.updateItemsUrl(response.obj)
        );
    }

    assignPermission(permissionCode: string) {
        if (this.permissionService.isUpdatable(permissionCode)) {
            this.isEditable = true;
        }
    }

    updateItems(product: IProduct) {
        let index: number;
        this.product.items.forEach(oProductItem => {
            product.items.forEach(nProductItem => {
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

    updateStyle(productStyle: IProductStyle) {
        let index: number;
        if (productStyle.type === ProductStyleType.COLOR) {
            this.product.colors.forEach(color => {
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
                let item: IProductItem;
                this.product.sizes.forEach(size => {
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
            this.product.sizes.forEach(size => {
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
                let item: IProductItem;
                this.product.colors.forEach(color => {
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

    deleteStyle(productStyle: IProductStyle) {
        let index: number;
        if (productStyle.type === ProductStyleType.COLOR) {
            this.product.colors.forEach(color => {
                if (color.id && color.id === productStyle.id) {
                    index = this.product.colors.indexOf(color);
                    this.product.colors.splice(index, 1);
                    return;
                } else if (color.tempId && color.tempId === productStyle.tempId) {
                    console.error('tempId matched: ' + color.tempId);
                    index = this.product.colors.indexOf(color);
                    this.product.colors.splice(index, 1);
                    return;
                }
            });
        } else if (productStyle.type === ProductStyleType.SIZE) {
            this.product.sizes.forEach(size => {
                if (size.id && size.id === productStyle.id) {
                    index = this.product.sizes.indexOf(size);
                    this.product.sizes.splice(index, 1);
                    return;
                } else if (size.tempId && size.tempId === productStyle.tempId) {
                    console.error('tempId matched: ' + size.tempId);
                    index = this.product.sizes.indexOf(size);
                    this.product.sizes.splice(index, 1);
                    return;
                }
            });
        }
        this.deleteItems(productStyle);
    }

    deleteItems(productStyle: IProductStyle) {
        const productItems: IProductItem[] = [];
        if (productStyle.type === ProductStyleType.COLOR) {
            this.product.items.forEach(item => {
                if (item.color.id && item.color.id === productStyle.id) {
                    productItems.push(item);
                } else if (item.color.tempId && item.color.tempId === productStyle.tempId) {
                    productItems.push(item);
                }
            });
        } else if (productStyle.type === ProductStyleType.SIZE) {
            this.product.items.forEach(item => {
                if (item.size.id && item.size.id === productStyle.id) {
                    productItems.push(item);
                } else if (item.size.tempId && item.size.tempId === productStyle.tempId) {
                    productItems.push(item);
                }
            });
        }
        this.product.items = this.product.items.filter(item => productItems.indexOf(item) === -1);
    }

    updateProductUrls(urls: IUrl[]) {
        urls.forEach(url => {
            this.product.urls.push(url);
        });
        this.resetSelectedUrl();
    }

    deleteUrl(nUrl: IUrl) {
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

    updateDetailOther(product: IProduct) {
        this.product.name = product.name;
        this.product.code = product.code;
        this.product.brand = product.brand;
        this.product.remark = product.remark;
        this.product.status = product.status;
    }

    updateItemsUrl(product: IProduct) {
        let index: number;
        product.items.forEach(nProductItem => {
            if (nProductItem.dirtyUrl) {
                this.product.items.forEach(oProductItem => {
                    if (oProductItem.id && oProductItem.id === nProductItem.id) {
                        index = this.product.items.indexOf(oProductItem);
                        this.product.items[index].url = nProductItem.url;
                        this.product.items[index].dirtyUrl = true;
                        return;
                    } else if (oProductItem.tempId && oProductItem.tempId === nProductItem.tempId) {
                        index = this.product.items.indexOf(oProductItem);
                        this.product.items[index].url = nProductItem.url;
                        this.product.items[index].dirtyUrl = true;
                        return;
                    }
                });
            }
        });
    }

    save() {
        this.isSaving = true;
        if (this.isSorted) {
            this.product.urls.forEach(url => {
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

    private subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>) {
        console.error('step0');
        result.subscribe((res: HttpResponse<IProduct>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: IProduct) {
        // this.eventManager.broadcast({ name: 'productListModification', content: 'OK'});
        this.isSaving = false;
        this.isEditing = false;
        console.error('result.id=' + result.id);
        this.router.navigate(['/product', result.id, 'view']);
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
        this.route.params.subscribe(params => {
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
        const obj: IProductStyle = Object.assign(new ProductStyle());
        obj.tempId = this.uuidService.get();
        obj.type = ProductStyleType.SIZE;
        this.editStyle(obj);
    }

    editStyle(obj: IProductStyle) {
        const copyObj: ProductStyle = Object.assign(new ProductStyle(), obj);
        this.popupService.open(ProductStyleDialogComponent as Component, copyObj, ProductDetailBroadcastName.PRODUCT_STYLE);
    }

    editItems(type: ProductItemsDialogType) {
        const copyObj: Product = Object.assign(new Product(), this.product);
        console.error('editItems, type: ' + type );
        // this.productDetailPopupService.open(PopupProductComponentType.PRODUCT_ITEMS, copyObj, ProductDetailBroadcastName.PRODUCT_ITEM, type);
        this.popupService.open(ProductItemsDialogComponent as Component, copyObj, ProductDetailBroadcastName.PRODUCT_ITEM, type);
    }

    editItemsUrl() {
        const copyObj: IProduct = Object.assign(new Product(), this.product);
        this.popupService.open(ProductItemsUrlDialogComponent as Component, copyObj, ProductDetailBroadcastName.PRODUCT_ITEMS_URL, null);
    }

    editOther() {
        const copyObj: IProduct = Object.assign(new Product(), this.product);
        this.popupService.open(ProductDetailOtherDialogComponent as Component, copyObj, ProductDetailBroadcastName.PRODUCT_DETAIL_OTHER, null);
    }

    changeStyle(productStyle: IProductStyle) {
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
            this.selectedItem = this.product.items.find(item => item.color.id === this.selectedColor.id && item.size.id === this.selectedSize.id);
            this.product.items.filter(item => item.color.id === this.selectedColor.id).forEach(item => {
                if (item.quantity <= 0) {
                    this.product.sizes.find(size => size.id === item.size.id).disabled = true;
                } else {
                    this.product.sizes.find(size => size.id === item.size.id).disabled = false;
                }
            });
            this.product.items.filter(item => item.size.id === this.selectedSize.id).forEach(item => {
                if (item.quantity <= 0) {
                    this.product.colors.find(color => color.id === item.color.id).disabled = true;
                } else {
                    this.product.colors.find(color => color.id === item.color.id).disabled = false;
                }
            });
        } else if (this.selectedColor.id) {
            this.selectedItem = {};
            this.product.items.filter(item => item.color.id === this.selectedColor.id).forEach(item => {
                if (item.quantity <= 0) {
                    this.product.sizes.find(size => size.id === item.size.id).disabled = true;
                } else {
                    this.product.sizes.find(size => size.id === item.size.id).disabled = false;
                }
            });
        } else if (this.selectedSize.id) {
            this.selectedItem = {};
            this.product.items.filter(item => item.size.id === this.selectedSize.id).forEach(item => {
                if (item.quantity <= 0) {
                    this.product.colors.find(color => color.id === item.color.id).disabled = true;
                } else {
                    this.product.colors.find(color => color.id === item.color.id).disabled = false;
                }
            });
        } else {
            this.selectedItem = {};
            this.product.colors.forEach(color => color.disabled = false);
            this.product.sizes.forEach(size => size.disabled = false);
        }
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                console.error('Product Detail registerAuthenticationSuccess');
//                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
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

    private subscribeToAddToCartResponse(result: Observable<HttpResponse<IMyOrder>>) {
        result.subscribe((res: HttpResponse<IMyOrder>) =>
            this.onAddToCartSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onAddToCartSuccess(result: IMyOrder) {
        // this.eventManager.broadcast({ name: 'productListModification', content: 'OK'});
        this.isSaving = false;
        this.isEditing = false;
        this.eventManager.broadcast({ name: 'myOrderModification', content: 'OK', obj: result});
        console.error('result.id=' + result.id);
    }

    uploadProductUrl() {
        const url = new Url();
        url.entityType = Product.name;
        url.entityId = this.product.id;
        url.sequence = this.product.urls ? (this.product.urls.length + 1) : 1;
        this.modalRef = this.fileUploadModelService.open(url, null, null, null, ProductDetailBroadcastName.PRODUCT_FILE);
    }

    popupDeleteUrl(url: IUrl) {
        const copyObj: IUrl = Object.assign(new Url(), url);
        this.urlPopupService.open(UrlDeleteDialogComponent as Component, copyObj);
    }

    selectUrl(nUrl: IUrl) {
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
            this.product.urls.filter(url => url.sequence === 1).map(url => {
                this.selectedUrl = url;
            });
        } else {
            this.selectedUrl = {};
        }
    }

    sort(event: SortEvent) {
        const url: IUrl = this.product.urls[event.currentIndex];
        this.product.urls.splice(event.currentIndex, 1);
        this.product.urls.splice(event.newIndex, 0, url);
        this.isSorted = true;
    }
}

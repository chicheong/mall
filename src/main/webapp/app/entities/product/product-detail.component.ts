import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormArray, AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';

import { IProduct, Product } from 'app/shared/model/product.model';
import { ProductService } from './product.service';
import { IShop } from 'app/shared/model/shop.model';
import { ShopService } from 'app/entities/shop/shop.service';
import { IProductStyle, ProductStyle } from 'app/shared/model/product-style.model';
import { IProductItem, ProductItem } from 'app/shared/model/product-item.model';
import { IMyUrl, MyUrl } from 'app/shared/model/my-url.model';
import { IPrice, Price } from 'app/shared/model/price.model';

import { ModalResultType } from "app/shared/model/enumerations/modal-result-type.model";
import { ProductStyleType } from "app/shared/model/enumerations/product-style-type.model";
import { CurrencyType } from "app/shared/model/enumerations/currency-type.model";
import { PermissionService } from "app/shared/permission/permission.service";
import { MyOrderService } from "app/entities/my-order/my-order.service";
import { Observable } from "rxjs";
import { IMyOrder } from "app/shared/model/my-order.model";

@Component({
  selector: 'jhi-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: [
    'product-detail.scss'
  ]
})
export class ProductDetailComponent implements OnInit {
  product: IProduct = {};

  isSorted = false;
  selectedColor: IProductStyle = {};
  selectedSize: IProductStyle = {};
  selectedItem?: IProductItem = {};
  selectedUrl?: IMyUrl;
  selectedCurrency: string | null = null;
  priceRange: string | null = null;
  isEditable = false;
  isProcessing = false;

  constructor(
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private myOrderService: MyOrderService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // eslint-disable-next-line no-console
    console.log('ngOnInit.');
    this.activatedRoute.data.subscribe(({ product }) => {
//      if (!product.id) {
//        const today = moment().startOf('day');
//        product.createdDate = today;
//        product.lastModifiedDate = today;
//      }

      // eslint-disable-next-line no-console
      console.log('this.activatedRoute.snapshot.params[id]: ' + this.activatedRoute.snapshot.params['id']);
      this.product = product;
      this.initCurrency();
      this.initPrice();
      this.assignPermission(this.product.permission);
      this.resetSelectedUrl();
      this.updateSelectedItem();
    });
  }
  
  initCurrency(): void {
      // TODO: Currency from User Info or Product Items
      this.selectedCurrency = CurrencyType.HKD + '$';
  }

  initPrice(): void {
      const len = this.product.items!.length;
      let min = Infinity, max = -Infinity;
      this.product.items!.forEach(item => {
          if (item && item.price) {
              if (item.price < min) {
                  min = item.price;
              }
              if (item.price > max) {
                  max = item.price;
              }
          }
      });
      if (min === max) {
          this.priceRange = '' + min ;
      } else {
          this.priceRange = min + ' - ' + max;   
      }
  }
  
  previousState(): void {
    window.history.back();
  }
  
  assignPermission(permissionCode: string | undefined): void {
      if (permissionCode && this.permissionService.isUpdatable(permissionCode)) {
          this.isEditable = true;
      }
  }
  
  changeStyle(productStyle: IProductStyle): void {
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
      this.updateSelectedItem();
  }
  
  updateSelectedItem(): void {
      if (this.product.colors!.length <= 1 && this.product.sizes!.length <= 1) { // Only one item, auto select
          this.selectedItem = this.product.items![0];
          if (this.selectedItem.url) {
              this.selectedUrl = this.selectedItem.url;
          } else {
              // no need to reset when item is selected
//              this.resetSelectedUrl();
          }
          if (this.selectedItem && this.selectedItem.quantity && this.selectedItem.quantity <= 0) {
              this.selectedItem = undefined;
          }
      } else if (this.product.colors!.length <= 1) { // Only sizes can be selected
          if (this.product.colors!.length === 1){
              this.selectedColor = this.product.colors![0];
          }
          if (this.selectedSize.id) {
              this.selectedItem = this.product.items!.find(item => item.size!.id === this.selectedSize.id);
              if (this.selectedItem!.url) {
                  this.selectedUrl = this.selectedItem!.url;
              } else {
                  // no need to reset when item is selected
//                  this.resetSelectedUrl();
              }
          }
          this.product.items!.forEach(item => {
              if (item.quantity && item.quantity <= 0) {
                  const selectedSize = this.product.sizes!.find(size => size.id === item.size!.id);
                  selectedSize!.disabled = true;
              } else {
                  const selectedSize = this.product.sizes!.find(size => size.id === item.size!.id);
                  selectedSize!.disabled = false;
              }
          });
      } else if (this.product.sizes!.length <= 1) {
          if (this.product.sizes!.length === 1){
              this.selectedSize = this.product.sizes![0];
          }
          if (this.selectedColor.id) {
              this.selectedItem = this.product.items!.find(item => item.color!.id === this.selectedColor.id);
              if (this.selectedItem!.url) {
                  this.selectedUrl = this.selectedItem!.url;
              } else {
                  // no need to reset when item is selected
//                  this.resetSelectedUrl();
              }
          }
          this.product.items!.forEach(item => {
              if (item.quantity && item.quantity <= 0) {
                  const selectedColor = this.product.colors!.find(color => color.id === item.color!.id);
                  selectedColor!.disabled = true;
              } else {
                  const selectedColor = this.product.colors!.find(color => color.id === item.color!.id);
                  selectedColor!.disabled = false;
              }
          });

      } else {
          if (this.selectedColor.id && this.selectedSize.id) {
              this.selectedItem = this.product.items!.find(item => item.color!.id === this.selectedColor.id && item.size!.id === this.selectedSize.id);
              this.product.items!.filter(item => item.color!.id === this.selectedColor.id).forEach(item => {
                  if (item.quantity && item.quantity <= 0) {
                      const selectedSize = this.product.sizes!.find(size => size.id === item.size!.id);
                      selectedSize!.disabled = true;
                  } else {
                      const selectedSize = this.product.sizes!.find(size => size.id === item.size!.id);
                      selectedSize!.disabled = false;
                  }
              });
              this.product.items!.filter(item => item.size!.id === this.selectedSize.id).forEach(item => {
                  if (item.quantity && item.quantity <= 0) {
                      const selectedColor = this.product.colors!.find(color => color.id === item.color!.id);
                      selectedColor!.disabled = true;
                  } else {
                      const selectedColor = this.product.colors!.find(color => color.id === item.color!.id);
                      selectedColor!.disabled = false;
                  }
              });
              if (this.selectedItem!.url) {
                  this.selectedUrl = this.selectedItem!.url;
              } else {
                  // no need to reset when item is selected
//                  this.resetSelectedUrl();
              }
          } else if (this.selectedColor.id) {
              this.selectedItem = {};
              this.product.items!.filter(item => item.color!.id === this.selectedColor.id).forEach(item => {
                  if (item.quantity && item.quantity <= 0) {
                      const selectedSize = this.product.sizes!.find(size => (item.size !== undefined) && (size.id === item.size.id));
                      if (selectedSize)
                          selectedSize.disabled = true;
                  } else {
                      const selectedSize = this.product.sizes!.find(size => (item.size !== undefined) && (size.id === item.size.id));
                      if (selectedSize)
                          selectedSize.disabled = false;
                  }
              });
          } else if (this.selectedSize.id) {
              this.selectedItem = {};
              this.product.items!.filter(item => item.size!.id === this.selectedSize.id).forEach(item => {
                  if (item.quantity && item.quantity <= 0) {
                      const selectedColor = this.product.colors!.find(color => color.id === item.color!.id);
                      if (selectedColor)
                          selectedColor.disabled = true;
                  } else {
                      const selectedColor = this.product.colors!.find(color => color.id === item.color!.id);
                      if (selectedColor)
                          selectedColor.disabled = false;
                  }              
              });
          } else {
              this.selectedItem = {};
              this.product.colors!.forEach(color => color.disabled = false);
              this.product.sizes!.forEach(size => size.disabled = false);
          }
      }
  }
  
  isAuthenticated(): boolean {
      return this.accountService.isAuthenticated();
  }

  login(): void {
      this.loginModalService.open();
  }

  addToCart(): void {
      if (this.isAuthenticated()) {
          this.isProcessing = true;
          this.subscribeToAddToCartResponse(
                  this.myOrderService.addToCart(this.selectedItem, 1));
      } else {
          this.login();
      }
  }

  protected subscribeToAddToCartResponse(result: Observable<HttpResponse<IMyOrder>>): void {
      result.subscribe(
        (res: HttpResponse<IMyOrder>) => this.onAddToCartSuccess(res.body), 
        () => this.onAddToCartError());
  }

  protected onAddToCartSuccess(result: IMyOrder | null): void {
      this.isProcessing = false;
      console.error('result.id=' + result!.id);
//      this.previousState();
  }

  protected onAddToCartError(): void {
    this.isProcessing = false;
  }
  
  trackById(index: number, item: IShop): any {
    return item.id;
  }

  selectUrl(nUrl: IMyUrl): void {
      if (this.product.urls){
          for (let i = 0; i < this.product.urls.length ; i++) {
              const url = this.product.urls[i];
              if (nUrl.id && url.id === nUrl.id) {
                  this.selectedUrl = url;
                  break;
              } else if (url.path === nUrl.path) {
                  this.selectedUrl = url;
                  break;
              }
          }
          console.error('product-detail->selectUrl->url.sequence: ' + this.selectedUrl!.sequence);
      }
  }
  
  resetSelectedUrl(): void {
      if (this.product.urls && this.product.urls[0]) {
          this.product.urls.filter(url => url.sequence === 1).map(url => {
              this.selectedUrl = url;
          });
      } else {
          this.selectedUrl = {};
      }
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormArray, AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IProduct, Product } from 'app/shared/model/product.model';
import { ProductService } from './product.service';
import { IShop } from 'app/shared/model/shop.model';
import { ShopService } from 'app/entities/shop/shop.service';
import { UuidService } from "app/shared/random/uuid.service";
import { ProductItem, IProductItem } from "app/shared/model/product-item.model";
import { IPrice } from "app/shared/model/price.model";
import { ProductStyleDialogComponent } from 'app/shared/popup/product/product-style-dialog.component';

import { ProductItemsDialogType, ProductItemsDialogComponent } from "app/shared/popup/product/product-items-dialog.component";
import { IProductStyle, ProductStyle } from "app/shared/model/product-style.model";
import { ProductStyleType } from "app/shared/model/enumerations/product-style-type.model";
import { CurrencyType } from "app/shared/model/enumerations/currency-type.model";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ModalResultType } from "app/shared/model/enumerations/modal-result-type.model";
import { IMyUrl, MyUrl } from "app/shared/model/my-url.model";
import { PermissionService } from "app/shared/permission/permission.service";
import { IQuantity } from "app/shared/model/quantity.model";

import { FileUploadDialogComponent } from 'app/shared/file-upload/file-upload-dialog.component';
import { ProductItemsUrlDialogComponent } from "app/shared/popup/product/product-items-url-dialog.component";
import { ProductDetailOtherDialogComponent } from "app/shared/popup/product/product-detail-other-dialog.component";

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: [
    'product-update.scss'
  ]
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;
  selectedUrl?: IMyUrl;
  isUpdatable = false;
  
  shops: IShop[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    code: [],
    brand: [],
    description: [],
    content: [],
    remark: [],
    status: [],
    permission: [],
    createdBy: [],
    createdDate: [],
    lastModifiedBy: [],
    lastModifiedDate: [],
    colors: this.fb.array([]),
    sizes: this.fb.array([]),
    items: this.fb.array([]),
    shopId: [],
    categories: [],
    urls: []
  });
  
  
  movies = [
        'Episode I - The Phantom Menace',
        'Episode II - Attack of the Clones',
        'Episode III - Revenge of the Sith',
        'Episode IV - A New Hope',
        'Episode V - The Empire Strikes Back',
        'Episode VI - Return of the Jedi',
        'Episode VII - The Force Awakens',
        'Episode VIII - The Last Jedi'
      ];
  
//  config: AngularEditorConfig = {
//          editable: true,
//          spellcheck: true,
//          height: '30rem',
//          minHeight: '5rem',
//          placeholder: 'Enter text here...',
//          translate: 'no',
//          customClasses: [
//            {
//              name: 'quote',
//              class: 'quote',
//            },
//            {
//              name: 'redText',
//              class: 'redText'
//            },
//            {
//              name: 'titleText',
//              class: 'titleText',
//              tag: 'h1',
//            },
//         ]
//  };

  constructor(
    protected productService: ProductService,
    protected shopService: ShopService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private uuidService: UuidService,
    protected modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    // eslint-disable-next-line no-console
    console.log('ngOnInit.');
    this.activatedRoute.data.subscribe(({ product }) => {

      this.updateForm(product);

      this.shopService.query().subscribe((res: HttpResponse<IShop[]>) => (this.shops = res.body || []));
    });
  }
  
  /** UpdateForm starts **/
  updateForm(product: IProduct): void {
      console.error('product-update->updateForm->product.createdDate: ' + product.createdDate + ', instanceof: ' + (product.createdDate instanceof moment));
      console.error('product-update->updateForm->product.createdDate: ' + (product.createdDate ? product.createdDate.format(DATE_TIME_FORMAT) : null));
      console.error('product-update->updateForm->product.lastModifiedDate: ' + product.lastModifiedDate);
      this.editForm = this.fb.group({
                          id: product.id,
                          name: product.name,
                          code: product.code,
                          brand: product.brand,
                          description: product.description,
                          content: product.content,
                          remark: product.remark,
                          status: product.status,
                          permission: product.permission,
                          createdBy: product.createdBy,
                          createdDate: product.createdDate ? product.createdDate.format(DATE_TIME_FORMAT) : null,
                          lastModifiedBy: product.lastModifiedBy,
                          lastModifiedDate: product.lastModifiedDate ? product.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
                          colors: this.convertToFormStyles(product.colors),
                          sizes: this.convertToFormStyles(product.sizes),
                          items: this.convertToFormItems(product.items),
                          shopId: product.shopId,
                          categories: product.categories,
                          urls: this.convertToFormUrls(product.urls)
                      });
  }
  
  convertToFormItems(productItems: IProductItem[] | undefined): FormArray {
      const formArray: FormArray = this.fb.array([]);
      if (productItems) {
          productItems.forEach((obj: IProductItem) => {
              formArray.push(this.convertToFormItem(obj));
          });
      }
      return formArray;
  }
  
  convertToFormItem(item: IProductItem): FormGroup {
//      console.error('product-update->convertToFormItem->item.id: ' + item.id + ', item.tempId: ' + item.tempId);
      return this.fb.group({
          id: item.id,
          tempId: item.tempId,
          code: item.code,
          isDefault: item.isDefault,
          quantity: item.quantity,
          currency: item.currency,
          price: item.price,
          color: item.color,
          size: item.size,
          prices: this.convertToFormPrices(item.prices),
          quantities: this.convertToFormQuantities(item.quantities),
          product: item.product,
          url: item.url,
          dirtyPrices: item.dirtyPrices,
          dirtyQuantities: item.dirtyQuantities,
          dirtyUrl: item.dirtyUrl
      });
  }
  
  convertToFormPrices(prices: IPrice[] | undefined): FormArray {
      const formArray: FormArray = this.fb.array([]);
      if (prices) {
          
//          console.error('product-update->convertToFormPrices->Object.getOwnPropertyNames(productItem.prices): ' + Object.getOwnPropertyNames(prices));
//          console.error('product-update->convertToFormPrices->editForm.get(colors)!.value: ' + this.editForm.get('colors')!.value);
          if (prices.length > 0){
//              console.error('product-update->convertToFormPrices->productItem.prices.length: ' + prices.length);
//              console.error('product-update->convertToFormPrices->Object.getOwnPropertyNames(productItem.prices[0]): ' + Object.getOwnPropertyNames(prices[0]));
          }
          
          prices.forEach((obj: IPrice) => {
              formArray.push(this.convertToFormPrice(obj));
          });
      }
      return formArray;
  }
  
  convertToFormPrice(obj: IPrice): FormGroup {
//      console.error('product-update->convertToFormPrice->obj.from: ' + obj.from);
//      console.error('product-update->convertToFormPrice->obj.to: ' + obj.to);
//      console.error('product-update->convertToFormPrice->moment(obj.from): ' + moment(obj.from));
//      console.error('product-update->convertToFormPrice->moment(obj.from).format(DATE_TIME_FORMAT): ' + moment(obj.from).format(DATE_TIME_FORMAT));
      return this.fb.group({
          id: obj.id,
          tempId: obj.tempId,
          from: obj.from ? ((obj.from instanceof moment)? obj.from: (moment(obj.from))) : null,
          to: obj.to ? ((obj.to instanceof moment)? obj.to: (moment(obj.to))) : null,
          price: obj.price,
          currency: obj.currency
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
          from: obj.from ? ((obj.from instanceof moment)? obj.from: (moment(obj.from))) : null,
          to: obj.to ? ((obj.to instanceof moment)? obj.to: (moment(obj.to))) : null,
          quantity: obj.quantity
      });
  }
  
  convertToFormStyles(styles: IProductStyle[] | undefined): FormArray {
      const formArray: FormArray = this.fb.array([]);
      if (styles) {
          styles.forEach((obj: IProductStyle) => {
              formArray.push(this.convertToFormStyle(obj));
          });
      }
      return formArray;
  }
  
  convertToFormStyle(style: IProductStyle): FormGroup {
      return this.fb.group({
          id: style.id,
          tempId: style.tempId,
          name: style.name,
          code: style.code,
          isDefault: style.isDefault,
          type: style.type,
          product: style.product,
          url: style.url,
          dirtyUrl: style.dirtyUrl,
          disabled: style.disabled
      });
  }
  
  convertToFormUrls(urls: IMyUrl[] | undefined): FormArray {
      const formArray: FormArray = this.fb.array([]);
      if (urls) {
          // sort by sequence
          const sortedUrls = urls.sort((a: IMyUrl, b: IMyUrl) => {
              if (a && b && a.sequence && b.sequence){
                  return a.sequence - b.sequence;    
              } else 
                  return 0;
          });
          
          sortedUrls.forEach((obj: IMyUrl) => {
              formArray.push(this.convertToFormUrl(obj));
          });
      }
      return formArray;
  }
  
  convertToFormUrl(url: IMyUrl): FormGroup {
      return this.fb.group({
          id: url.id,
          entityType: url.entityType,
          entityId: url.entityId,
          path: url.path,
          fileName: url.fileName,
          sequence: url.sequence,
          description: url.description,
          createdBy: url.createdBy,
          createdDate: url.createdDate,
          lastModifiedBy: url.lastModifiedBy,
          lastModifiedDate: url.lastModifiedDate
      });
  }
  /** UpdateForm ends **/
  
  /** CreateFromForm starts **/
  private createFromForm(): IProduct {
      const product: IProduct = new Product();
      product.id = this.editForm.get(['id'])!.value;
      product.name = this.editForm.get(['name'])!.value;
      product.code = this.editForm.get(['code'])!.value;
      product.brand = this.editForm.get(['brand'])!.value;
      product.description = this.editForm.get(['description'])!.value;
      product.content = this.editForm.get(['content'])!.value;
      product.remark = this.editForm.get(['remark'])!.value;
      product.status = this.editForm.get(['status'])!.value;
      product.permission = this.editForm.get(['permission'])!.value;
      product.createdBy = this.editForm.get(['createdBy'])!.value;
      product.createdDate = this.editForm.get(['createdDate'])!.value ? 
                              moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT): undefined,
      product.lastModifiedBy = this.editForm.get(['lastModifiedBy'])!.value;
      product.lastModifiedDate = this.editForm.get(['lastModifiedDate'])!.value ? 
                                  moment(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT): undefined
      product.colors = this.editForm.get(['colors'])!.value;
      product.sizes = this.editForm.get(['sizes'])!.value;
//      product.items = this.editForm.get(['items'])!.value;
      product.shopId = this.editForm.get(['shopId'])!.value;
      product.categories = this.editForm.get(['categories'])!.value;
      product.urls = this.editForm.get(['urls'])!.value;
      
//      console.error('createFromForm()->this.editForm.get(["items"])!.value:' + this.editForm.get(['items'])!.value);
      
      product.items = [];
      this.items.controls.forEach((itemFormGroup: AbstractControl) => {
//          console.error('product-update->createFromForm->itemFormGroup: ' + itemFormGroup.value.code);
          product.items!.push(this.convertFromFormItem(itemFormGroup));
      });
      return product;
      
//    return {
//      ...new Product(),
//      id: this.editForm.get(['id'])!.value,
//      name: this.editForm.get(['name'])!.value,
//      code: this.editForm.get(['code'])!.value,
//      brand: this.editForm.get(['brand'])!.value,
//      description: this.editForm.get(['description'])!.value,
//      content: this.editForm.get(['content'])!.value,
//      remark: this.editForm.get(['remark'])!.value,
//      status: this.editForm.get(['status'])!.value,
//      permission: this.editForm.get(['permission'])!.value,
//      createdBy: this.editForm.get(['createdBy'])!.value,
//      createdDate: this.editForm.get(['createdDate'])!.value
//        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
//        : undefined,
//      lastModifiedBy: this.editForm.get(['lastModifiedBy'])!.value,
//      lastModifiedDate: this.editForm.get(['lastModifiedDate'])!.value
//        ? moment(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
//        : undefined,
//      colors: this.editForm.get(['colors'])!.value,
//      sizes: this.editForm.get(['sizes'])!.value,
//      items: this.editForm.get(['items'])!.value,
//      shopId: this.editForm.get(['shopId'])!.value,
//      categories: this.editForm.get(['categories'])!.value,
//      urls: this.editForm.get(['urls'])!.value
//    };
  }
  
  private convertFromFormItem(itemFormGroup: AbstractControl): IProductItem {
      const productItem: IProductItem = new ProductItem();
      productItem.id = itemFormGroup.value.id;
      productItem.tempId = itemFormGroup.value.tempId;
      productItem.code = itemFormGroup.value.code;
      productItem.isDefault = itemFormGroup.value.isDefault;
      productItem.quantity = itemFormGroup.value.quantity;
      productItem.currency = itemFormGroup.value.currency;
      productItem.price = itemFormGroup.value.price;
      productItem.color = itemFormGroup.value.color;
      productItem.size = itemFormGroup.value.size;
      productItem.prices = itemFormGroup.value.prices; // FormArray will be treated as Object Array
      productItem.quantities = itemFormGroup.value.quantities;
      productItem.product = itemFormGroup.value.product;
      productItem.url = itemFormGroup.value.url;
      productItem.dirtyPrices = itemFormGroup.value.dirtyPrices;
      productItem.dirtyQuantities = itemFormGroup.value.dirtyQuantities;
      productItem.dirtyUrl = itemFormGroup.value.dirtyUrl;
      
      return productItem;
  }
  
  private convertFromFormStyle(styleFormGroup: AbstractControl): IProductStyle {
      const style: IProductStyle = new ProductStyle();
      style.id = styleFormGroup.value.id;
      style.tempId = styleFormGroup.value.tempId;
      style.name = styleFormGroup.value.name;
      style.code = styleFormGroup.value.code;
      style.isDefault = styleFormGroup.value.isDefault;
      style.type = styleFormGroup.value.type;
      style.product = styleFormGroup.value.product;
      style.url = styleFormGroup.value.url;
      style.dirtyUrl = styleFormGroup.value.dirtyUrl;
      style.disabled = styleFormGroup.value.disabled;
      
      return style;
  }
  
  private convertFromFormUrl(urlFormGroup: AbstractControl): IMyUrl {
      const url: IMyUrl = new MyUrl();
      url.id = urlFormGroup.value.id;
      url.entityType = urlFormGroup.value.entityType;
      url.entityId = urlFormGroup.value.entityId;
      url.path = urlFormGroup.value.path;
      url.fileName = urlFormGroup.value.fileName;
      url.sequence = urlFormGroup.value.sequence;
      url.description = urlFormGroup.value.description;
      url.createdBy = urlFormGroup.value.createdBy;
      url.createdDate = urlFormGroup.value.createdDate;
      url.lastModifiedBy = urlFormGroup.value.lastModifiedBy;
      url.lastModifiedDate = urlFormGroup.value.lastModifiedDate;
      return url;
  }
  /** CreateFromForm ends **/
  
  get items() : FormArray {
      return this.editForm.get('items') as FormArray  // this.editForm.controls['items'] as FormArray
  }
  
  get colors() : FormArray {
      return this.editForm.get('colors') as FormArray
  }
  
  get sizes() : FormArray {
      return this.editForm.get('sizes') as FormArray 
  }
  
  get urls() : FormArray {
      return this.editForm.get('urls') as FormArray 
  }
  
  assignPermission(permissionCode: string): void {
      if (this.permissionService.isUpdatable(permissionCode)) {
          this.isUpdatable = true;
      }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      const today = moment().startOf('day');
      if (!product.createdDate){
          product.createdDate = today;    
      }
      if (!product.lastModifiedDate){
          product.lastModifiedDate = today;    
      }
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }
  
//  private updateDateToMoment(product: IProduct): IProduct {
//      product.items!.forEach((item) => {
//          if (item.prices){
//              item.prices.forEach((price) => {
//                 if (price.from){
//                     console.error('product-update->updateDateToMoment->price.from before edit: ' + price.from);
//                     price.from = moment(price.from, DATE_TIME_FORMAT);
//                 }
//                 if (price.to){
//                     console.error('product-update->updateDateToMoment->price.to before edit: ' + price.to);
//                     price.to = moment(price.to, DATE_TIME_FORMAT);
//                 }
//              })    
//          }
//          if (item.prices){
//              item.prices.forEach((price) => {
//                 if (price.from){
//                     console.error('product-update->updateDateToMoment->price.from after edit: ' + price.from);
//                 }
//                 if (price.to){
//                     console.error('product-update->updateDateToMoment->price.to after edit: ' + price.to);
//                 }
//              })    
//          }
//      });
//      return product;
//  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
  
  updateItems(product: IProduct, type: ProductItemsDialogType): void {
//    let index: number;
    this.items.value.forEach((oProductItem: IProductItem) => {
        product.items!.forEach(nProductItem => {
            
            if ((oProductItem.id && oProductItem.id === nProductItem.id) || 
                    (oProductItem.tempId && oProductItem.tempId === nProductItem.tempId)) {
                console.error('oProductItem and nProductItem matched');
                
                switch (type) {
                    case ProductItemsDialogType.CODE:
                        oProductItem.code = nProductItem.code;
                        
                        if (nProductItem.code != null) {
                            console.error('Object.getOwnPropertyNames(oProductItem.code): ' + Object.getOwnPropertyNames(oProductItem.code));
                            console.error('Object.getOwnPropertyNames(nProductItem.code): ' + Object.getOwnPropertyNames(nProductItem.code));
                            console.error('nProductItem.code.length: ' + nProductItem.code.length);
                            console.error('nProductItem.code[0]: ' + nProductItem.code[0]);
                            console.error('nProductItem.code[1]: ' + nProductItem.code[1]);
                            console.error('nProductItem.code[2]: ' + nProductItem.code[6]);
//                            oProductItem.code = nProductItem.code;
                            if (oProductItem.code != null){
                                console.error('oProductItem.code[0]: ' + oProductItem.code[0]);
                                console.error('oProductItem.code[1]: ' + oProductItem.code[1]);
                                console.error('oProductItem.code[2]: ' + oProductItem.code[6]);                                  
                            }
                        }
                        break;
                    case ProductItemsDialogType.PRICE:
                        console.error('product-update->updateItems->PRICE->oProductItem.price: ' + oProductItem.price);
                        console.error('product-update->updateItems->PRICE->nProductItem.price: ' + nProductItem.price); 
                        oProductItem.price = nProductItem.price;
                        if (nProductItem.prices != null) {
                            console.error('Object.getOwnPropertyNames(oProductItem.prices): ' + Object.getOwnPropertyNames(oProductItem.prices));
                            console.error('Object.getOwnPropertyNames(nProductItem.prices): ' + Object.getOwnPropertyNames(nProductItem.prices)); 
                            // oProductItem.prices = [];
//                            nProductItem.prices.forEach((price) => {
//                                oProductItem.prices!.push(price);
//                                console.error('product-detail->updateItems->a price is pushed');
//                            });
                            oProductItem.prices = nProductItem.prices;
                            oProductItem.dirtyPrices = nProductItem.dirtyPrices;
                            // index = this.editForm.get(['items'])!.value.indexOf(oProductItem);
                            // this.editForm.get(['items'])!.value[index] = nProductItem;
                            console.error('Object.getOwnPropertyNames(oProductItem.prices): ' + Object.getOwnPropertyNames(oProductItem.prices));
                        }
                        if (nProductItem.price != null) {

                            // index = this.editForm.get(['items'])!.value.indexOf(oProductItem);
                            // this.editForm.get(['items'])!.value[index] = nProductItem;
                        }
                        break;
                    case ProductItemsDialogType.QUANTITY:
                        oProductItem.quantity = nProductItem.quantity;
                        if (nProductItem.quantities != null) {
                            oProductItem.quantities = nProductItem.quantities;
                            oProductItem.dirtyQuantities = nProductItem.dirtyQuantities;
                        }
                        break;
                    default:
                        console.error("type: " + type);
                        break;
                }
                
                if (nProductItem.price != null) {
                    console.error('Object.getOwnPropertyNames(oProductItem.price): ' + Object.getOwnPropertyNames(oProductItem.price));
                    console.error('Object.getOwnPropertyNames(nProductItem.price): ' + Object.getOwnPropertyNames(nProductItem.price)); 
                    oProductItem.price = nProductItem.price;
                    // index = this.editForm.get(['items'])!.value.indexOf(oProductItem);
                    // this.editForm.get(['items'])!.value[index] = nProductItem;
                }
                return;
            }
        });
    });
    
    this.items.value.forEach((oProductItem: IProductItem) => {
        console.error('oProductItem.code[6]: ' + oProductItem.code![6]);
    });
  }
  
  updateStyle(productStyle: IProductStyle): void {
      const product: IProduct = this.createFromForm();
      let index: number;
      let found = false;
      if (productStyle.type === ProductStyleType.COLOR) {
          product.colors!.forEach((style) => {
              if (style.id && style.id === productStyle.id || style.tempId && style.tempId === productStyle.tempId) {
//                  console.error('product-update->updateStyle->item found.');
                  index = product.colors!.indexOf(style);
                  product.colors![index] = productStyle;
                  found = true;
                  return;
              }
          });
          if (!found){
//              console.error('product-update->updateStyle->found->productStyle.id: ' + productStyle.id + ', productStyle.tempId: ' + productStyle.tempId);
              if (product.colors!.length === 0) {
                  product.colors!.push(productStyle);
                  if (product.sizes!.length === 0) {
                      const item = Object.assign(new ProductItem());
                      item.tempId = this.uuidService.get();
                      item.color = productStyle;
                      item.size = undefined;
                      item.quantity = 1;
                      item.currency = CurrencyType.HKD;
                      product.items!.push(item);
                  } else {
                      product.items!.forEach((item) => {
                          item.color = productStyle;
                      })
                  }
              } else {
                  product.colors!.push(productStyle);
                  let item: IProductItem;
                  if (product.sizes!.length === 0) {
                      item = Object.assign(new ProductItem());
                      item.tempId = this.uuidService.get();
//                      item.code = 'unknown';
                      item.color = productStyle;
                      item.size = undefined;
                      item.quantity = 1;
                      item.currency = CurrencyType.HKD;
                      product.items!.push(item);
                  } else {
                      product.sizes!.forEach((size) => {
                          item = Object.assign(new ProductItem());
                          item.tempId = this.uuidService.get();
//                          item.code = 'unknown';
                          item.color = productStyle;
                          item.size = size;
                          item.quantity = 1;
                          item.currency = CurrencyType.HKD;
                          product.items!.push(item);
                        })
                  }
              }
          }
          this.updateForm(product);
      } else if (productStyle.type === ProductStyleType.SIZE) {
          product.sizes!.forEach((style) => {
              if (style.id && style.id === productStyle.id || style.tempId && style.tempId === productStyle.tempId) {
//                  console.error('product-update->updateStyle->item found.');
                  index = product.sizes!.indexOf(style);
                  product.sizes![index] = productStyle;
                  found = true;
                  return;
              }
          });
          if (!found){
              if (product.sizes!.length === 0) {
                  product.sizes!.push(productStyle);
                  if (product.colors!.length === 0) {
                      const item = Object.assign(new ProductItem());
                      item.tempId = this.uuidService.get();
                      item.color = undefined;
                      item.size = productStyle;
                      item.quantity = 1;
                      item.currency = CurrencyType.HKD;
                      product.items!.push(item);
                  } else {
                      product.items!.forEach((item) => {
                          item.size = productStyle;
                      })
                  }
              } else {
                  product.sizes!.push(productStyle);
                  let item: IProductItem;
                  if (product.colors!.length === 0) {
                      item = Object.assign(new ProductItem());
                      item.tempId = this.uuidService.get();
                      item.color = undefined;
                      item.size = productStyle;
                      item.quantity = 1;
                      item.currency = CurrencyType.HKD;
                      product.items!.push(item);
                  } else {
                      product.colors!.forEach((color) => {
                          item = Object.assign(new ProductItem());
                          item.tempId = this.uuidService.get();
                          item.color = color;
                          item.size = productStyle;
                          item.quantity = 1;
                          item.currency = CurrencyType.HKD;
                          product.items!.push(item);
                      }) 
                  }
              }
          }
          this.updateForm(product);
      }

//      let index= -1;
//      if (productStyle.type === ProductStyleType.COLOR) {
//          this.colors.value.forEach((color: IProductStyle) => {
//              if (color.id && color.id === productStyle.id) {
//                  console.error('color found');
//                  index = this.colors.value.indexOf(color);
//                  this.colors.value[index] = productStyle;
//                  return;
//              } else if (color.tempId && color.tempId === productStyle.tempId) {
//                  console.error('color found');
//                  index = this.colors.value.indexOf(color);
//                  this.colors.value[index] = productStyle;
//                  return;
//              }
//          });
//          if (index !== -1) {
//              this.colors.value.push(productStyle);
//              let item: IProductItem;
//              this.sizes.value.forEach((size: IProductStyle) => {
//                  item = Object.assign(new ProductItem());
//                  item.tempId = this.uuidService.get();
//                  item.color = productStyle;
//                  item.size = size;
//                  item.quantity = 1;
//                  item.currency = CurrencyType.HKD;
//                  this.items.value.push(item);
//              });
//          }
//      } else if (productStyle.type === ProductStyleType.SIZE) {
//          this.sizes.value.forEach((size: IProductStyle) => {
//              if (size.id && size.id === productStyle.id) {
//                  index = this.sizes.value.indexOf(size);
//                  this.sizes.value[index] = productStyle;
//                  return;
//              } else if (size.tempId && size.tempId === productStyle.tempId) {
//                  index = this.editForm.get(['sizes'])!.value.indexOf(size);
//                  this.sizes.value[index] = productStyle;
//                  return;
//              }
//          });
//          if (index !== -1) {
//              this.sizes.value.push(productStyle);
//              let item: IProductItem;
//              this.colors.value.forEach((color: IProductStyle) => {
//                  item = Object.assign(new ProductItem());
//                  item.tempId = this.uuidService.get();
//                  item.color = color;
//                  item.size = productStyle;
//                  item.quantity = 1;
//                  item.currency = CurrencyType.HKD;
//                  this.items.value.push(item);
//              });
//          }
//      }
  }

  deleteStyle(productStyle: IProductStyle): void {
      let index: number;
      if (productStyle.type === ProductStyleType.COLOR) {
          this.colors.value.forEach((color: IProductStyle) => {
              if (color.id && color.id === productStyle.id) {
                  index = this.colors.value.indexOf(color);
                  this.colors.removeAt(index);
                  return;
              } else if (color.tempId && color.tempId === productStyle.tempId) {
                  console.error('tempId matched: ' + color.tempId);
                  index = this.colors.value.indexOf(color);
                  this.colors.removeAt(index);
                  return;
              }
          });
      } else if (productStyle.type === ProductStyleType.SIZE) {
          this.sizes.value.forEach((size: IProductStyle) => {
              if (size.id && size.id === productStyle.id) {
                  index = this.sizes.value.indexOf(size);
                  // this.sizes.controls.splice(index, 1);
                  // this.sizes.value.splice(index, 1);
                  this.sizes.removeAt(index);
                  return;
              } else if (size.tempId && size.tempId === productStyle.tempId) {
                  console.error('tempId matched: ' + size.tempId);
                  index = this.sizes.value.indexOf(size);
                  this.sizes.removeAt(index);
                  return;
              }
          });
      }
      this.deleteItems(productStyle);
      if (this.colors.length === 0 && this.sizes.length === 0 ){
          const style: IProductStyle = new ProductStyle();
          style.id = undefined;
          style.tempId = this.uuidService.get();
          style.name = 'DEFAULT';
          style.code = '';
          style.isDefault = true;
          style.type = ProductStyleType.COLOR;
          style.product = undefined;
          style.url = undefined;
          style.dirtyUrl = false;
          style.disabled = false;
          this.colors.insert(0, this.convertToFormStyle(style));
          
          const item = Object.assign(new ProductItem());
          item.tempId = this.uuidService.get();
          item.color = style;
          item.size = undefined;
          item.quantity = 1;
          item.currency = CurrencyType.HKD;
          this.items.insert(0, this.convertToFormItem(item));
      }
  }
  
  deleteItems(productStyle: IProductStyle): void {
      if (this.colors.length === 0 && this.sizes.length === 0) {
          console.error('product-update->deleteItems->this.colors.length === 0 && this.sizes.length === 0');
          this.items.clear();
      } else if (this.colors.length === 0) {
          console.error('product-update->deleteItems->this.colors.length === 0');
          this.items.value.forEach((item: IProductItem) => {
              item.color = undefined;
          });
      } else if (this.sizes.length === 0) {
          console.error('product-update->deleteItems->this.sizes.length === 0');
          this.items.value.forEach((item: IProductItem) => {
              item.size = undefined;
          });
      } else {
          console.error('product-update->deleteItems->else');
          let index: number;
          this.items.value.forEach((item: IProductItem) => {
              if (productStyle.type === ProductStyleType.COLOR) {
                  if (item.color) {
                      if (item.color.id && item.color.id === productStyle.id) {
                          index = this.items.value.indexOf(item);
                          this.items.removeAt(index);
                      } else if (item.color.tempId && item.color.tempId === productStyle.tempId) {
                          index = this.items.value.indexOf(item);
                          this.items.removeAt(index);
                      }
                  }
              } else if (productStyle.type === ProductStyleType.SIZE) {
                  if (item.size) {
                      if (item.size.id && item.size.id === productStyle.id) {
                          index = this.items.value.indexOf(item);
                          this.items.removeAt(index);
                      } else if (item.size.tempId && item.size.tempId === productStyle.tempId) {
                          index = this.items.value.indexOf(item);
                          this.items.removeAt(index);
                      }
                  }
              }
          })
      }
      
      this.items.value.forEach((item: IProductItem) => {
          console.error('product-update->deleteItems->item.color: ' + item.color + ', item.size: ' + item.size);
      })
//      const productItems: IProductItem[] = [];
//      if (productStyle.type === ProductStyleType.COLOR) {
//          this.items.value.forEach((item: IProductItem) => {
//              if (item.color) {
//                  if (item.color.id && item.color.id === productStyle.id) {
//                      productItems.push(item);
//                  } else if (item.color.tempId && item.color.tempId === productStyle.tempId) {
//                      productItems.push(item);
//                  }
//              }
//          });
//      } else if (productStyle.type === ProductStyleType.SIZE) {
//          this.items.value.forEach((item: IProductItem) => {
//              if (item.size!.id && item.size!.id === productStyle.id) {
//                  productItems.push(item);
//              } else if (item.size!.tempId && item.size!.tempId === productStyle.tempId) {
//                  productItems.push(item);
//              }
//          });
//      }
//      this.editForm.controls['items'].setValue(this.editForm.get(['items'])!.value.filter((item: IProductItem) => !productItems.includes(item)));
  }
  
  updateProductUrls(urls: IMyUrl[]): void {
      console.error('product-update->updateProductUrls->urls: ' +Object.getOwnPropertyNames(urls[0]));
      if (urls) {
          urls.forEach((url: IMyUrl) => {
              console.error('product-update->updateProductUrls->obj: ' + url);
              console.error('product-update->updateProductUrls->this.convertToFormUrl(obj): ' + this.convertToFormUrl(url));
              this.urls.push(this.convertToFormUrl(url));
          });
      }
      this.resetSelectedUrl();
  }
  
  deleteUrl(nUrl: IMyUrl): void {
//      for (let i = 0; i < this.product.urls.length; i++) {
//          const url = this.product.urls[i];
//          if (nUrl.id && url.id === nUrl.id) {
//              this.product.urls.splice(i, 1);
//              break;
//          } else if (url.path === nUrl.path) {
//              this.product.urls.splice(i, 1);
//              break;
//          }
//      }
      this.resetSelectedUrl();
  }
  
  updateDetailOther(product: IProduct): void {
      this.editForm.controls['name'].setValue(product.name);
      this.editForm.controls['code'].setValue(product.code);
      this.editForm.controls['brand'].setValue(product.brand);
      this.editForm.controls['content'].setValue(product.content);
      this.editForm.controls['description'].setValue(product.description);
      this.editForm.controls['remark'].setValue(product.remark);
      this.editForm.controls['status'].setValue(product.status);
  }
  
  updateItemsUrl(product: IProduct): void {
      console.error('product-update-component->updateItemsUrl->product: ' + product);
      let index: number;
      product.items!.forEach(nProductItem => {
          if (nProductItem.dirtyUrl) {
              this.items.value.forEach((oProductItem: IProductItem) => {
                  if ((oProductItem.id && oProductItem.id === nProductItem.id) || (oProductItem.tempId && oProductItem.tempId === nProductItem.tempId)) {                     
                      index = this.items.value.indexOf(oProductItem);
                      this.items.value[index].url = nProductItem.url;
                      this.items.value[index].dirtyUrl = true;
                      return;
                  }
              });
          }
      });
  }

  cancel(): void {
      const id = this.editForm.get(['id'])!.value;
      if (id) {
          this.router.navigate(['/product', id, 'view']);
      } else {
          this.previousState();
      }
  }
  
  addColor(): void {
      const obj: ProductStyle = Object.assign(new ProductStyle());
      obj.tempId = this.uuidService.get();
      obj.type = ProductStyleType.COLOR;
      this.editStyle(obj);
  }

  addSize(): void {
      const obj: IProductStyle = Object.assign(new ProductStyle());
      obj.tempId = this.uuidService.get();
      obj.type = ProductStyleType.SIZE;
      this.editStyle(obj);
  }
  
  editStyle(obj: IProductStyle): void { // AbstractControl
//    const copyObj: ProductStyle = Object.assign(new ProductStyle(), obj);
//    this.popupService.open(ProductStyleDialogComponent as Component, copyObj, ProductDetailBroadcastName.PRODUCT_STYLE);

    const modalRef: NgbModalRef = this.modalService.open(ProductStyleDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.object = obj;
    modalRef.result.then((result) => {
        if (result && result.type) {
            if (result.type === ModalResultType.UPDATE) {
                this.updateStyle(result.obj);
            } else if (result.type === ModalResultType.DELETE) {
                this.deleteStyle(result.obj);
            }
        }
    }).catch(() => {});
  }
  
  editStyleFromControl(obj: AbstractControl): void {
      this.editStyle(this.convertFromFormStyle(obj));
  }

    editCode(): void {
        this.editItems(ProductItemsDialogType.CODE);
    }

    editPrice(): void {
        this.editItems(ProductItemsDialogType.PRICE);
    }
    
    editQuantity(): void {
        this.editItems(ProductItemsDialogType.QUANTITY);
    }

    editItems(type: ProductItemsDialogType): void {
    //    const copyObj: Product = Object.assign(new Product(), this.product);
    //    this.popupService.open(ProductItemsDialogComponent as Component, copyObj, ProductDetailBroadcastName.PRODUCT_ITEM, type);
        
        const modalRef: NgbModalRef = this.modalService.open(ProductItemsDialogComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.object = this.createFromForm();
        modalRef.componentInstance.type =  type;
        modalRef.result.then((result) => {
            if (result) {
                this.updateItems(result, type);
            }
        }).catch(() => {});
    }

    editItemsUrl(): void {
    //    const copyObj: IProduct = Object.assign(new Product(), this.product);
    //    this.popupService.open(ProductItemsUrlDialogComponent as Component, copyObj, ProductDetailBroadcastName.PRODUCT_ITEMS_URL, null);
        const modalRef: NgbModalRef = this.modalService.open(ProductItemsUrlDialogComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.object = this.createFromForm();
        modalRef.result.then((result) => {
            console.error('product-update->editItemsUrl->result: ' + result);
            if (result) {
                console.error('product-update->editItemsUrl->result: ' + result);
                this.updateItemsUrl(result);
            }
        }).catch(() => {});
    }
    
    editOther(): void {
//        const copyObj: IProduct = Object.assign(new Product(), this.product);
//        this.popupService.open(ProductDetailOtherDialogComponent as Component, copyObj, ProductDetailBroadcastName.PRODUCT_DETAIL_OTHER, null);
        
        const modalRef: NgbModalRef = this.modalService.open(ProductDetailOtherDialogComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.object = this.createFromForm();
        modalRef.result.then((result) => {
            if (result) {
                console.error('product-update->uploadProductUrl->result: ' + result);
                this.updateDetailOther(result);
            }
        }).catch(() => {});
    }

  trackById(index: number, item: IShop): any {
    return item.id;
  }
  
  selectUrl(url: AbstractControl): void {
//      if (this.product.urls){
//          for (let i = 0; i < this.product.urls.length ; i++) {
//              const url = this.product.urls[i];
//              if (nUrl.id && url.id === nUrl.id) {
//                  this.selectedUrl = url;
//                  break;
//              } else if (url.path === nUrl.path) {
//                  this.selectedUrl = url;
//                  break;
//              }
//          }
//      }
      if (url && this.urls) {
          this.urls.controls.forEach((urlFormGroup: AbstractControl) => {
              if (url.value.id && url.value.id === urlFormGroup.value.id) {
                  console.error('url id matched');
                  this.selectedUrl = this.convertFromFormUrl(urlFormGroup);
              } else if (url.value.sequence && url.value.sequence === urlFormGroup.value.sequence) {
                  console.error('url sequence matched');
                  this.selectedUrl = this.convertFromFormUrl(urlFormGroup);
              }
          })
      }
  }
  
  uploadProductUrl(): void {
      const url: IMyUrl = new MyUrl();
      url.entityType = Product.name;
      console.error('product-update->uploadProductUrl->this.editForm.get([id])!.value: ' + this.editForm.get(['id'])!.value);
      console.error('product-update->uploadProductUrl->this.editForm.get([urls])!.value: ' + this.editForm.get(['urls'])!.value);
      url.entityId = this.editForm.get(['id'])!.value;
      url.sequence = this.editForm.get(['urls'])!.value ? (this.editForm.get(['urls'])!.value.length + 1) : 1;
//      this.modalRef = this.fileUploadModelService.open(url, null, null, null, ProductDetailBroadcastName.PRODUCT_FILE);
      
      const modalRef: NgbModalRef = this.modalService.open(FileUploadDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.object = url;
//      modalRef.componentInstance.type =  type;
      modalRef.result.then((result) => {
          if (result) {
              console.error('product-update->uploadProductUrl->result: ' + result);
              this.updateProductUrls(result);
          }
      }).catch(() => {});
  }

  popupDeleteUrl(url: IMyUrl): void {
//      const copyObj: IUrl = Object.assign(new Url(), url);
//      this.urlPopupService.open(UrlDeleteDialogComponent as Component, copyObj);
  }

  resetSelectedUrl(): void {
//      if (this.product.urls && this.product.urls[0]) {
//          this.product.urls.filter(url => url.sequence === 1).map(url => {
//              this.selectedUrl = url;
//          });
//      } else {
//          this.selectedUrl = {};
//      }
      let found = false;
      if (this.urls && this.urls.controls && this.urls.controls[0]) {
          this.urls.controls.forEach((urlFormGroup: AbstractControl) => {
              if (urlFormGroup.value.sequence === 1) {
                  this.selectedUrl = this.convertFromFormUrl(urlFormGroup);
                  found = true;
              }
          })
      }
      if (!found) {
          this.selectedUrl = {};
      }
  }

  drop(event: CdkDragDrop<string[]>): void {
//      moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
      // Correct sequence
      // If drop within container, change position. Otherwise, delete.
      const urls = this.urls.controls;
      if (event.isPointerOverContainer) {
          const from = event.previousIndex;
          const to = event.currentIndex;
          if (from === to) {
              return;
          }
          console.error('event.previousIndex: ' + event.previousIndex);
          console.error('event.currentIndex: ' + event.currentIndex);
          const delta = to < from ? -1 : 1;
//          for (let i = from; i !== to; i += delta) {
//              this.product.urls[i].sequence = this.product.urls[i + delta].sequence;
//          }
          for (let i = to; i !== from; i -= delta) {
              urls[i].value.sequence = urls[i - delta].value.sequence;
          }
          urls[from].value.sequence = to + 1;
          // Correct position
          const url = urls[from];
          urls.splice(event.previousIndex, 1);
          urls.splice(event.currentIndex, 0, url);
          urls.forEach((urlControl) => {
              console.error('urlControl.sequence: ' + urlControl.value.sequence);
          })
          
      } else {
          urls.splice(event.previousIndex, 1);
      }
      // Mark sequence changed
//      this.isSorted = true;
  }
  
  
}

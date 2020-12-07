import { NgModule } from '@angular/core';
import { MallSharedLibsModule } from './shared-libs.module';
import { MaterialModule } from 'app/shared/material.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { StringEllipsisPipe } from './formatting/string-ellipsis.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { LoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { ProductStyleDialogComponent } from './popup/product/product-style-dialog.component';
import { ProductItemsDialogComponent } from 'app/shared/popup/product/product-items-dialog.component';
import { ProductItemsUrlDialogComponent } from 'app/shared/popup/product/product-items-url-dialog.component';
import { ProductDetailOtherDialogComponent } from 'app/shared/popup/product/product-detail-other-dialog.component';
import { PricesDialogComponent } from 'app/shared/popup/product/prices-dialog.component';
import { QuantitiesDialogComponent } from 'app/shared/popup/product/quantities-dialog.component';
import { GetItemFromColorSizePipe } from 'app/shared/popup/product/get-item-from-color-size.pipe';
import { FileUploadDialogComponent } from 'app/shared/file-upload/file-upload-dialog.component';
import { FileUploadComponent } from 'app/shared/file-upload/file-upload.component';
import { ProductCardComponent } from './layout/product/product-card.component';
import { SearchBarComponent } from './layout/search/search-bar.component';

@NgModule({
  imports: [MallSharedLibsModule, MaterialModule],
  declarations: [
    FindLanguageFromKeyPipe,
    StringEllipsisPipe,
    AlertComponent, 
    AlertErrorComponent, 
    LoginModalComponent, 
    HasAnyAuthorityDirective,
    ProductStyleDialogComponent,
    ProductItemsDialogComponent,
    ProductItemsUrlDialogComponent,
    ProductDetailOtherDialogComponent,
    PricesDialogComponent,
    QuantitiesDialogComponent,
    GetItemFromColorSizePipe,
    ProductCardComponent,
    SearchBarComponent,
    FileUploadDialogComponent,
    FileUploadComponent
  ],
  entryComponents: [LoginModalComponent],
  exports: [
    MallSharedLibsModule,
    MaterialModule,
    FindLanguageFromKeyPipe,
    StringEllipsisPipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    ProductStyleDialogComponent,
    ProductItemsDialogComponent,
    ProductItemsUrlDialogComponent,
    ProductDetailOtherDialogComponent,
    PricesDialogComponent,
    QuantitiesDialogComponent,
    GetItemFromColorSizePipe,
    ProductCardComponent,
    SearchBarComponent,
    FileUploadDialogComponent,
    FileUploadComponent
  ]
})
export class MallSharedModule {}

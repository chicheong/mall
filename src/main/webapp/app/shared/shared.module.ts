import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import { MallSharedLibsModule, MallSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';
import { JhMaterialModule } from 'app/shared/jh-material.module';
import { FileUploadDialogComponent } from './file-upload/file-upload-dialog.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ProductDetailOtherDialogComponent } from './popup/product/product-detail-other-dialog.component';
import { ProductItemsDialogComponent } from './popup/product/product-items-dialog.component';
import { ProductItemsUrlDialogComponent } from './popup/product/product-items-url-dialog.component';
import { ProductStyleDialogComponent } from './popup/product/product-style-dialog.component';
import { PricesDialogComponent } from './popup/product/prices-dialog.component';
import { QuantitiesDialogComponent } from './popup/product/quantities-dialog.component';
import { GetItemFromColorSizePipe } from './popup/product/get-item-from-color-size.pipe';
import { ProductCardComponent } from './layout/product/product-card.component';
import { SearchBarComponent } from './layout/search/search-bar.component';

@NgModule({
    imports: [MallSharedLibsModule, MallSharedCommonModule, JhMaterialModule],
    declarations: [
        JhiLoginModalComponent, HasAnyAuthorityDirective,
        FileUploadDialogComponent,
        FileUploadComponent,
        ProductDetailOtherDialogComponent,
        ProductItemsDialogComponent,
        ProductItemsUrlDialogComponent,
        ProductStyleDialogComponent,
        PricesDialogComponent,
        QuantitiesDialogComponent,
        GetItemFromColorSizePipe,
        ProductCardComponent,
        SearchBarComponent
    ],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    entryComponents: [
        JhiLoginModalComponent,
        FileUploadDialogComponent,
        FileUploadComponent,
        ProductDetailOtherDialogComponent,
        ProductItemsDialogComponent,
        ProductItemsUrlDialogComponent,
        ProductStyleDialogComponent,
        PricesDialogComponent,
        QuantitiesDialogComponent,
        ProductCardComponent,
        SearchBarComponent
    ],
    exports: [MallSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective, JhMaterialModule, ProductCardComponent, SearchBarComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallSharedModule {
    static forRoot() {
        return {
            ngModule: MallSharedModule
        };
    }
}

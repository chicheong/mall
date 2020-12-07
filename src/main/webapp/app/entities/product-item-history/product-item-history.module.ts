import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { ProductItemHistoryComponent } from './product-item-history.component';
import { ProductItemHistoryDetailComponent } from './product-item-history-detail.component';
import { ProductItemHistoryUpdateComponent } from './product-item-history-update.component';
import { ProductItemHistoryDeleteDialogComponent } from './product-item-history-delete-dialog.component';
import { productItemHistoryRoute } from './product-item-history.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(productItemHistoryRoute)],
  declarations: [
    ProductItemHistoryComponent,
    ProductItemHistoryDetailComponent,
    ProductItemHistoryUpdateComponent,
    ProductItemHistoryDeleteDialogComponent
  ],
  entryComponents: [ProductItemHistoryDeleteDialogComponent]
})
export class MallProductItemHistoryModule {}

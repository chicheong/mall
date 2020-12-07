import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { ProductHistoryComponent } from './product-history.component';
import { ProductHistoryDetailComponent } from './product-history-detail.component';
import { ProductHistoryUpdateComponent } from './product-history-update.component';
import { ProductHistoryDeleteDialogComponent } from './product-history-delete-dialog.component';
import { productHistoryRoute } from './product-history.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(productHistoryRoute)],
  declarations: [
    ProductHistoryComponent,
    ProductHistoryDetailComponent,
    ProductHistoryUpdateComponent,
    ProductHistoryDeleteDialogComponent
  ],
  entryComponents: [ProductHistoryDeleteDialogComponent]
})
export class MallProductHistoryModule {}

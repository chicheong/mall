import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { ProductStyleHistoryComponent } from './product-style-history.component';
import { ProductStyleHistoryDetailComponent } from './product-style-history-detail.component';
import { ProductStyleHistoryUpdateComponent } from './product-style-history-update.component';
import { ProductStyleHistoryDeleteDialogComponent } from './product-style-history-delete-dialog.component';
import { productStyleHistoryRoute } from './product-style-history.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(productStyleHistoryRoute)],
  declarations: [
    ProductStyleHistoryComponent,
    ProductStyleHistoryDetailComponent,
    ProductStyleHistoryUpdateComponent,
    ProductStyleHistoryDeleteDialogComponent
  ],
  entryComponents: [ProductStyleHistoryDeleteDialogComponent]
})
export class MallProductStyleHistoryModule {}

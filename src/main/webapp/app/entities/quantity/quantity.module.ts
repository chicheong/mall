import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { QuantityComponent } from './quantity.component';
import { QuantityDetailComponent } from './quantity-detail.component';
import { QuantityUpdateComponent } from './quantity-update.component';
import { QuantityDeleteDialogComponent } from './quantity-delete-dialog.component';
import { quantityRoute } from './quantity.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(quantityRoute)],
  declarations: [QuantityComponent, QuantityDetailComponent, QuantityUpdateComponent, QuantityDeleteDialogComponent],
  entryComponents: [QuantityDeleteDialogComponent]
})
export class MallQuantityModule {}

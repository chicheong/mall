import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { ShippingComponent } from './shipping.component';
import { ShippingDetailComponent } from './shipping-detail.component';
import { ShippingUpdateComponent } from './shipping-update.component';
import { ShippingDeleteDialogComponent } from './shipping-delete-dialog.component';
import { shippingRoute } from './shipping.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(shippingRoute)],
  declarations: [ShippingComponent, ShippingDetailComponent, ShippingUpdateComponent, ShippingDeleteDialogComponent],
  entryComponents: [ShippingDeleteDialogComponent]
})
export class MallShippingModule {}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from 'app/shared/shared.module';
import { ShippingPriceRuleComponent } from './shipping-price-rule.component';
import { ShippingPriceRuleDetailComponent } from './shipping-price-rule-detail.component';
import { ShippingPriceRuleUpdateComponent } from './shipping-price-rule-update.component';
import { ShippingPriceRuleDeleteDialogComponent } from './shipping-price-rule-delete-dialog.component';
import { shippingPriceRuleRoute } from './shipping-price-rule.route';

@NgModule({
  imports: [MallSharedModule, RouterModule.forChild(shippingPriceRuleRoute)],
  declarations: [
    ShippingPriceRuleComponent,
    ShippingPriceRuleDetailComponent,
    ShippingPriceRuleUpdateComponent,
    ShippingPriceRuleDeleteDialogComponent
  ],
  entryComponents: [ShippingPriceRuleDeleteDialogComponent]
})
export class MallShippingPriceRuleModule {}

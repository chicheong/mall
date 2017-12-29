import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MallUserInfoModule } from './user-info/user-info.module';
import { MallMyAccountModule } from './my-account/my-account.module';
import { MallCompanyModule } from './company/company.module';
import { MallDepartmentModule } from './department/department.module';
import { MallOfficeModule } from './office/office.module';
import { MallAddressModule } from './address/address.module';
import { MallCountryModule } from './country/country.module';
import { MallStateModule } from './state/state.module';
import { MallShopModule } from './shop/shop.module';
import { MallDelegationModule } from './delegation/delegation.module';
import { MallCategoryModule } from './category/category.module';
import { MallProductModule } from './product/product.module';
import { MallProductItemModule } from './product-item/product-item.module';
import { MallProductHistoryModule } from './product-history/product-history.module';
import { MallProductItemHistoryModule } from './product-item-history/product-item-history.module';
import { MallPriceModule } from './price/price.module';
import { MallCurrencyRateModule } from './currency-rate/currency-rate.module';
import { MallOrderItemModule } from './order-item/order-item.module';
import { MallOrderStatusHistoryModule } from './order-status-history/order-status-history.module';
import { MallMyOrderModule } from './my-order/my-order.module';
import { MallProductStyleModule } from './product-style/product-style.module';
import { MallProductStyleHistoryModule } from './product-style-history/product-style-history.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        MallUserInfoModule,
        MallMyAccountModule,
        MallCompanyModule,
        MallDepartmentModule,
        MallOfficeModule,
        MallAddressModule,
        MallCountryModule,
        MallStateModule,
        MallShopModule,
        MallDelegationModule,
        MallCategoryModule,
        MallProductModule,
        MallProductItemModule,
        MallProductHistoryModule,
        MallProductItemHistoryModule,
        MallPriceModule,
        MallCurrencyRateModule,
        MallOrderItemModule,
        MallOrderStatusHistoryModule,
        MallMyOrderModule,
        MallProductStyleModule,
        MallProductStyleHistoryModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallEntityModule {}

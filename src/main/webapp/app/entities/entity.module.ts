import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'user-info',
                loadChildren: './user-info/user-info.module#MallUserInfoModule'
            },
            {
                path: 'my-account',
                loadChildren: './my-account/my-account.module#MallMyAccountModule'
            },
            {
                path: 'company',
                loadChildren: './company/company.module#MallCompanyModule'
            },
            {
                path: 'department',
                loadChildren: './department/department.module#MallDepartmentModule'
            },
            {
                path: 'office',
                loadChildren: './office/office.module#MallOfficeModule'
            },
            {
                path: 'address',
                loadChildren: './address/address.module#MallAddressModule'
            },
            {
                path: 'country',
                loadChildren: './country/country.module#MallCountryModule'
            },
            {
                path: 'state',
                loadChildren: './state/state.module#MallStateModule'
            },
            {
                path: 'delegation',
                loadChildren: './delegation/delegation.module#MallDelegationModule'
            },
            {
                path: 'category',
                loadChildren: './category/category.module#MallCategoryModule'
            },
            {
                path: 'product',
                loadChildren: './product/product.module#MallProductModule'
            },
            {
                path: 'product-style',
                loadChildren: './product-style/product-style.module#MallProductStyleModule'
            },
            {
                path: 'product-item',
                loadChildren: './product-item/product-item.module#MallProductItemModule'
            },
            {
                path: 'product-history',
                loadChildren: './product-history/product-history.module#MallProductHistoryModule'
            },
            {
                path: 'product-style-history',
                loadChildren: './product-style-history/product-style-history.module#MallProductStyleHistoryModule'
            },
            {
                path: 'product-item-history',
                loadChildren: './product-item-history/product-item-history.module#MallProductItemHistoryModule'
            },
            {
                path: 'price',
                loadChildren: './price/price.module#MallPriceModule'
            },
            {
                path: 'quantity',
                loadChildren: './quantity/quantity.module#MallQuantityModule'
            },
            {
                path: 'currency-rate',
                loadChildren: './currency-rate/currency-rate.module#MallCurrencyRateModule'
            },
            {
                path: 'url',
                loadChildren: './url/url.module#MallUrlModule'
            },
            {
                path: 'order-status-history',
                loadChildren: './order-status-history/order-status-history.module#MallOrderStatusHistoryModule'
            },
            {
                path: 'card',
                loadChildren: './card/card.module#MallCardModule'
            },
            {
                path: 'shipping-type',
                loadChildren: './shipping-type/shipping-type.module#MallShippingTypeModule'
            },
            {
                path: 'shipping-status-history',
                loadChildren: './shipping-status-history/shipping-status-history.module#MallShippingStatusHistoryModule'
            },
            {
                path: 'payment-status-history',
                loadChildren: './payment-status-history/payment-status-history.module#MallPaymentStatusHistoryModule'
            },
            {
                path: 'payment',
                loadChildren: './payment/payment.module#MallPaymentModule'
            },
            {
                path: 'payment-card',
                loadChildren: './payment-card/payment-card.module#MallPaymentCardModule'
            },
            {
                path: 'shop',
                loadChildren: './shop/shop.module#MallShopModule'
            },
            {
                path: 'shipping-price-rule',
                loadChildren: './shipping-price-rule/shipping-price-rule.module#MallShippingPriceRuleModule'
            },
            {
                path: 'my-order',
                loadChildren: './my-order/my-order.module#MallMyOrderModule'
            },
            {
                path: 'order-shop',
                loadChildren: './order-shop/order-shop.module#MallOrderShopModule'
            },
            {
                path: 'order-item',
                loadChildren: './order-item/order-item.module#MallOrderItemModule'
            },
            {
                path: 'shipping',
                loadChildren: './shipping/shipping.module#MallShippingModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallEntityModule {}

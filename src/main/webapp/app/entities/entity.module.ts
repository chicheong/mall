import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-info',
        loadChildren: () => import('./user-info/user-info.module').then(m => m.MallUserInfoModule)
      },
      {
        path: 'my-account',
        loadChildren: () => import('./my-account/my-account.module').then(m => m.MallMyAccountModule)
      },
      {
        path: 'company',
        loadChildren: () => import('./company/company.module').then(m => m.MallCompanyModule)
      },
      {
        path: 'department',
        loadChildren: () => import('./department/department.module').then(m => m.MallDepartmentModule)
      },
      {
        path: 'office',
        loadChildren: () => import('./office/office.module').then(m => m.MallOfficeModule)
      },
      {
        path: 'contact',
        loadChildren: () => import('./contact/contact.module').then(m => m.MallContactModule)
      },
      {
        path: 'address',
        loadChildren: () => import('./address/address.module').then(m => m.MallAddressModule)
      },
      {
        path: 'country',
        loadChildren: () => import('./country/country.module').then(m => m.MallCountryModule)
      },
      {
        path: 'my-state',
        loadChildren: () => import('./my-state/my-state.module').then(m => m.MallMyStateModule)
      },
      {
        path: 'shop',
        loadChildren: () => import('./shop/shop.module').then(m => m.MallShopModule)
      },
      {
        path: 'shipping-price-rule',
        loadChildren: () => import('./shipping-price-rule/shipping-price-rule.module').then(m => m.MallShippingPriceRuleModule)
      },
      {
        path: 'delegation',
        loadChildren: () => import('./delegation/delegation.module').then(m => m.MallDelegationModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.MallCategoryModule)
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.MallProductModule)
      },
      {
        path: 'product-style',
        loadChildren: () => import('./product-style/product-style.module').then(m => m.MallProductStyleModule)
      },
      {
        path: 'product-item',
        loadChildren: () => import('./product-item/product-item.module').then(m => m.MallProductItemModule)
      },
      {
        path: 'product-history',
        loadChildren: () => import('./product-history/product-history.module').then(m => m.MallProductHistoryModule)
      },
      {
        path: 'product-style-history',
        loadChildren: () => import('./product-style-history/product-style-history.module').then(m => m.MallProductStyleHistoryModule)
      },
      {
        path: 'product-item-history',
        loadChildren: () => import('./product-item-history/product-item-history.module').then(m => m.MallProductItemHistoryModule)
      },
      {
        path: 'price',
        loadChildren: () => import('./price/price.module').then(m => m.MallPriceModule)
      },
      {
        path: 'quantity',
        loadChildren: () => import('./quantity/quantity.module').then(m => m.MallQuantityModule)
      },
      {
        path: 'currency-rate',
        loadChildren: () => import('./currency-rate/currency-rate.module').then(m => m.MallCurrencyRateModule)
      },
      {
        path: 'my-order',
        loadChildren: () => import('./my-order/my-order.module').then(m => m.MallMyOrderModule)
      },
      {
        path: 'order-shop',
        loadChildren: () => import('./order-shop/order-shop.module').then(m => m.MallOrderShopModule)
      },
      {
        path: 'order-item',
        loadChildren: () => import('./order-item/order-item.module').then(m => m.MallOrderItemModule)
      },
      {
        path: 'order-status-history',
        loadChildren: () => import('./order-status-history/order-status-history.module').then(m => m.MallOrderStatusHistoryModule)
      },
      {
        path: 'my-url',
        loadChildren: () => import('./my-url/my-url.module').then(m => m.MallMyUrlModule)
      },
      {
        path: 'card',
        loadChildren: () => import('./card/card.module').then(m => m.MallCardModule)
      },
      {
        path: 'shipping',
        loadChildren: () => import('./shipping/shipping.module').then(m => m.MallShippingModule)
      },
      {
        path: 'shipping-type',
        loadChildren: () => import('./shipping-type/shipping-type.module').then(m => m.MallShippingTypeModule)
      },
      {
        path: 'shipping-status-history',
        loadChildren: () => import('./shipping-status-history/shipping-status-history.module').then(m => m.MallShippingStatusHistoryModule)
      },
      {
        path: 'payment',
        loadChildren: () => import('./payment/payment.module').then(m => m.MallPaymentModule)
      },
      {
        path: 'payment-card',
        loadChildren: () => import('./payment-card/payment-card.module').then(m => m.MallPaymentCardModule)
      },
      {
        path: 'payment-status-history',
        loadChildren: () => import('./payment-status-history/payment-status-history.module').then(m => m.MallPaymentStatusHistoryModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class MallEntityModule {}

import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { OrderShopComponentsPage, OrderShopDeleteDialog, OrderShopUpdatePage } from './order-shop.page-object';

const expect = chai.expect;

describe('OrderShop e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let orderShopComponentsPage: OrderShopComponentsPage;
  let orderShopUpdatePage: OrderShopUpdatePage;
  let orderShopDeleteDialog: OrderShopDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load OrderShops', async () => {
    await navBarPage.goToEntity('order-shop');
    orderShopComponentsPage = new OrderShopComponentsPage();
    await browser.wait(ec.visibilityOf(orderShopComponentsPage.title), 5000);
    expect(await orderShopComponentsPage.getTitle()).to.eq('mallApp.orderShop.home.title');
    await browser.wait(ec.or(ec.visibilityOf(orderShopComponentsPage.entities), ec.visibilityOf(orderShopComponentsPage.noResult)), 1000);
  });

  it('should load create OrderShop page', async () => {
    await orderShopComponentsPage.clickOnCreateButton();
    orderShopUpdatePage = new OrderShopUpdatePage();
    expect(await orderShopUpdatePage.getPageTitle()).to.eq('mallApp.orderShop.home.createOrEditLabel');
    await orderShopUpdatePage.cancel();
  });

  it('should create and save OrderShops', async () => {
    const nbButtonsBeforeCreate = await orderShopComponentsPage.countDeleteButtons();

    await orderShopComponentsPage.clickOnCreateButton();

    await promise.all([
      orderShopUpdatePage.setTotalInput('5'),
      orderShopUpdatePage.currencySelectLastOption(),
      orderShopUpdatePage.setRemarkInput('remark'),
      orderShopUpdatePage.shippingSelectLastOption(),
      orderShopUpdatePage.shopSelectLastOption(),
      orderShopUpdatePage.orderSelectLastOption()
    ]);

    expect(await orderShopUpdatePage.getTotalInput()).to.eq('5', 'Expected total value to be equals to 5');
    expect(await orderShopUpdatePage.getRemarkInput()).to.eq('remark', 'Expected Remark value to be equals to remark');

    await orderShopUpdatePage.save();
    expect(await orderShopUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await orderShopComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last OrderShop', async () => {
    const nbButtonsBeforeDelete = await orderShopComponentsPage.countDeleteButtons();
    await orderShopComponentsPage.clickOnLastDeleteButton();

    orderShopDeleteDialog = new OrderShopDeleteDialog();
    expect(await orderShopDeleteDialog.getDialogTitle()).to.eq('mallApp.orderShop.delete.question');
    await orderShopDeleteDialog.clickOnConfirmButton();

    expect(await orderShopComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

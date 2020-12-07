import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MyOrderComponentsPage, MyOrderDeleteDialog, MyOrderUpdatePage } from './my-order.page-object';

const expect = chai.expect;

describe('MyOrder e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let myOrderComponentsPage: MyOrderComponentsPage;
  let myOrderUpdatePage: MyOrderUpdatePage;
  let myOrderDeleteDialog: MyOrderDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load MyOrders', async () => {
    await navBarPage.goToEntity('my-order');
    myOrderComponentsPage = new MyOrderComponentsPage();
    await browser.wait(ec.visibilityOf(myOrderComponentsPage.title), 5000);
    expect(await myOrderComponentsPage.getTitle()).to.eq('mallApp.myOrder.home.title');
    await browser.wait(ec.or(ec.visibilityOf(myOrderComponentsPage.entities), ec.visibilityOf(myOrderComponentsPage.noResult)), 1000);
  });

  it('should load create MyOrder page', async () => {
    await myOrderComponentsPage.clickOnCreateButton();
    myOrderUpdatePage = new MyOrderUpdatePage();
    expect(await myOrderUpdatePage.getPageTitle()).to.eq('mallApp.myOrder.home.createOrEditLabel');
    await myOrderUpdatePage.cancel();
  });

  it('should create and save MyOrders', async () => {
    const nbButtonsBeforeCreate = await myOrderComponentsPage.countDeleteButtons();

    await myOrderComponentsPage.clickOnCreateButton();

    await promise.all([
      myOrderUpdatePage.setTotalInput('5'),
      myOrderUpdatePage.currencySelectLastOption(),
      myOrderUpdatePage.setRemarkInput('remark'),
      myOrderUpdatePage.statusSelectLastOption(),
      myOrderUpdatePage.shippingSelectLastOption(),
      myOrderUpdatePage.billingSelectLastOption(),
      myOrderUpdatePage.accountSelectLastOption()
    ]);

    expect(await myOrderUpdatePage.getTotalInput()).to.eq('5', 'Expected total value to be equals to 5');
    expect(await myOrderUpdatePage.getRemarkInput()).to.eq('remark', 'Expected Remark value to be equals to remark');

    await myOrderUpdatePage.save();
    expect(await myOrderUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await myOrderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last MyOrder', async () => {
    const nbButtonsBeforeDelete = await myOrderComponentsPage.countDeleteButtons();
    await myOrderComponentsPage.clickOnLastDeleteButton();

    myOrderDeleteDialog = new MyOrderDeleteDialog();
    expect(await myOrderDeleteDialog.getDialogTitle()).to.eq('mallApp.myOrder.delete.question');
    await myOrderDeleteDialog.clickOnConfirmButton();

    expect(await myOrderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

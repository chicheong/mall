import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  OrderStatusHistoryComponentsPage,
  OrderStatusHistoryDeleteDialog,
  OrderStatusHistoryUpdatePage
} from './order-status-history.page-object';

const expect = chai.expect;

describe('OrderStatusHistory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let orderStatusHistoryComponentsPage: OrderStatusHistoryComponentsPage;
  let orderStatusHistoryUpdatePage: OrderStatusHistoryUpdatePage;
  let orderStatusHistoryDeleteDialog: OrderStatusHistoryDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load OrderStatusHistories', async () => {
    await navBarPage.goToEntity('order-status-history');
    orderStatusHistoryComponentsPage = new OrderStatusHistoryComponentsPage();
    await browser.wait(ec.visibilityOf(orderStatusHistoryComponentsPage.title), 5000);
    expect(await orderStatusHistoryComponentsPage.getTitle()).to.eq('mallApp.orderStatusHistory.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(orderStatusHistoryComponentsPage.entities), ec.visibilityOf(orderStatusHistoryComponentsPage.noResult)),
      1000
    );
  });

  it('should load create OrderStatusHistory page', async () => {
    await orderStatusHistoryComponentsPage.clickOnCreateButton();
    orderStatusHistoryUpdatePage = new OrderStatusHistoryUpdatePage();
    expect(await orderStatusHistoryUpdatePage.getPageTitle()).to.eq('mallApp.orderStatusHistory.home.createOrEditLabel');
    await orderStatusHistoryUpdatePage.cancel();
  });

  it('should create and save OrderStatusHistories', async () => {
    const nbButtonsBeforeCreate = await orderStatusHistoryComponentsPage.countDeleteButtons();

    await orderStatusHistoryComponentsPage.clickOnCreateButton();

    await promise.all([
      orderStatusHistoryUpdatePage.setEffectiveDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      orderStatusHistoryUpdatePage.statusSelectLastOption(),
      orderStatusHistoryUpdatePage.orderSelectLastOption()
    ]);

    expect(await orderStatusHistoryUpdatePage.getEffectiveDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected effectiveDate value to be equals to 2000-12-31'
    );

    await orderStatusHistoryUpdatePage.save();
    expect(await orderStatusHistoryUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await orderStatusHistoryComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last OrderStatusHistory', async () => {
    const nbButtonsBeforeDelete = await orderStatusHistoryComponentsPage.countDeleteButtons();
    await orderStatusHistoryComponentsPage.clickOnLastDeleteButton();

    orderStatusHistoryDeleteDialog = new OrderStatusHistoryDeleteDialog();
    expect(await orderStatusHistoryDeleteDialog.getDialogTitle()).to.eq('mallApp.orderStatusHistory.delete.question');
    await orderStatusHistoryDeleteDialog.clickOnConfirmButton();

    expect(await orderStatusHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

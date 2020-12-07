import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  PaymentStatusHistoryComponentsPage,
  PaymentStatusHistoryDeleteDialog,
  PaymentStatusHistoryUpdatePage
} from './payment-status-history.page-object';

const expect = chai.expect;

describe('PaymentStatusHistory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let paymentStatusHistoryComponentsPage: PaymentStatusHistoryComponentsPage;
  let paymentStatusHistoryUpdatePage: PaymentStatusHistoryUpdatePage;
  let paymentStatusHistoryDeleteDialog: PaymentStatusHistoryDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load PaymentStatusHistories', async () => {
    await navBarPage.goToEntity('payment-status-history');
    paymentStatusHistoryComponentsPage = new PaymentStatusHistoryComponentsPage();
    await browser.wait(ec.visibilityOf(paymentStatusHistoryComponentsPage.title), 5000);
    expect(await paymentStatusHistoryComponentsPage.getTitle()).to.eq('mallApp.paymentStatusHistory.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(paymentStatusHistoryComponentsPage.entities), ec.visibilityOf(paymentStatusHistoryComponentsPage.noResult)),
      1000
    );
  });

  it('should load create PaymentStatusHistory page', async () => {
    await paymentStatusHistoryComponentsPage.clickOnCreateButton();
    paymentStatusHistoryUpdatePage = new PaymentStatusHistoryUpdatePage();
    expect(await paymentStatusHistoryUpdatePage.getPageTitle()).to.eq('mallApp.paymentStatusHistory.home.createOrEditLabel');
    await paymentStatusHistoryUpdatePage.cancel();
  });

  it('should create and save PaymentStatusHistories', async () => {
    const nbButtonsBeforeCreate = await paymentStatusHistoryComponentsPage.countDeleteButtons();

    await paymentStatusHistoryComponentsPage.clickOnCreateButton();

    await promise.all([
      paymentStatusHistoryUpdatePage.setEffectiveDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      paymentStatusHistoryUpdatePage.statusSelectLastOption(),
      paymentStatusHistoryUpdatePage.paymentSelectLastOption()
    ]);

    expect(await paymentStatusHistoryUpdatePage.getEffectiveDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected effectiveDate value to be equals to 2000-12-31'
    );

    await paymentStatusHistoryUpdatePage.save();
    expect(await paymentStatusHistoryUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await paymentStatusHistoryComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last PaymentStatusHistory', async () => {
    const nbButtonsBeforeDelete = await paymentStatusHistoryComponentsPage.countDeleteButtons();
    await paymentStatusHistoryComponentsPage.clickOnLastDeleteButton();

    paymentStatusHistoryDeleteDialog = new PaymentStatusHistoryDeleteDialog();
    expect(await paymentStatusHistoryDeleteDialog.getDialogTitle()).to.eq('mallApp.paymentStatusHistory.delete.question');
    await paymentStatusHistoryDeleteDialog.clickOnConfirmButton();

    expect(await paymentStatusHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

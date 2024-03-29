import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CurrencyRateComponentsPage, CurrencyRateDeleteDialog, CurrencyRateUpdatePage } from './currency-rate.page-object';

const expect = chai.expect;

describe('CurrencyRate e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let currencyRateComponentsPage: CurrencyRateComponentsPage;
  let currencyRateUpdatePage: CurrencyRateUpdatePage;
  let currencyRateDeleteDialog: CurrencyRateDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load CurrencyRates', async () => {
    await navBarPage.goToEntity('currency-rate');
    currencyRateComponentsPage = new CurrencyRateComponentsPage();
    await browser.wait(ec.visibilityOf(currencyRateComponentsPage.title), 5000);
    expect(await currencyRateComponentsPage.getTitle()).to.eq('mallApp.currencyRate.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(currencyRateComponentsPage.entities), ec.visibilityOf(currencyRateComponentsPage.noResult)),
      1000
    );
  });

  it('should load create CurrencyRate page', async () => {
    await currencyRateComponentsPage.clickOnCreateButton();
    currencyRateUpdatePage = new CurrencyRateUpdatePage();
    expect(await currencyRateUpdatePage.getPageTitle()).to.eq('mallApp.currencyRate.home.createOrEditLabel');
    await currencyRateUpdatePage.cancel();
  });

  it('should create and save CurrencyRates', async () => {
    const nbButtonsBeforeCreate = await currencyRateComponentsPage.countDeleteButtons();

    await currencyRateComponentsPage.clickOnCreateButton();

    await promise.all([
      currencyRateUpdatePage.setFromInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      currencyRateUpdatePage.setToInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      currencyRateUpdatePage.setRateInput('5'),
      currencyRateUpdatePage.sourceCurrencySelectLastOption(),
      currencyRateUpdatePage.targetCurrencySelectLastOption()
    ]);

    expect(await currencyRateUpdatePage.getFromInput()).to.contain('2001-01-01T02:30', 'Expected from value to be equals to 2000-12-31');
    expect(await currencyRateUpdatePage.getToInput()).to.contain('2001-01-01T02:30', 'Expected to value to be equals to 2000-12-31');
    expect(await currencyRateUpdatePage.getRateInput()).to.eq('5', 'Expected rate value to be equals to 5');

    await currencyRateUpdatePage.save();
    expect(await currencyRateUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await currencyRateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last CurrencyRate', async () => {
    const nbButtonsBeforeDelete = await currencyRateComponentsPage.countDeleteButtons();
    await currencyRateComponentsPage.clickOnLastDeleteButton();

    currencyRateDeleteDialog = new CurrencyRateDeleteDialog();
    expect(await currencyRateDeleteDialog.getDialogTitle()).to.eq('mallApp.currencyRate.delete.question');
    await currencyRateDeleteDialog.clickOnConfirmButton();

    expect(await currencyRateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

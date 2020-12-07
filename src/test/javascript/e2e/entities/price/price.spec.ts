import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PriceComponentsPage, PriceDeleteDialog, PriceUpdatePage } from './price.page-object';

const expect = chai.expect;

describe('Price e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let priceComponentsPage: PriceComponentsPage;
  let priceUpdatePage: PriceUpdatePage;
  let priceDeleteDialog: PriceDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Prices', async () => {
    await navBarPage.goToEntity('price');
    priceComponentsPage = new PriceComponentsPage();
    await browser.wait(ec.visibilityOf(priceComponentsPage.title), 5000);
    expect(await priceComponentsPage.getTitle()).to.eq('mallApp.price.home.title');
    await browser.wait(ec.or(ec.visibilityOf(priceComponentsPage.entities), ec.visibilityOf(priceComponentsPage.noResult)), 1000);
  });

  it('should load create Price page', async () => {
    await priceComponentsPage.clickOnCreateButton();
    priceUpdatePage = new PriceUpdatePage();
    expect(await priceUpdatePage.getPageTitle()).to.eq('mallApp.price.home.createOrEditLabel');
    await priceUpdatePage.cancel();
  });

  it('should create and save Prices', async () => {
    const nbButtonsBeforeCreate = await priceComponentsPage.countDeleteButtons();

    await priceComponentsPage.clickOnCreateButton();

    await promise.all([
      priceUpdatePage.setFromInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      priceUpdatePage.setToInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      priceUpdatePage.setPriceInput('5'),
      priceUpdatePage.currencySelectLastOption(),
      priceUpdatePage.itemSelectLastOption()
    ]);

    expect(await priceUpdatePage.getFromInput()).to.contain('2001-01-01T02:30', 'Expected from value to be equals to 2000-12-31');
    expect(await priceUpdatePage.getToInput()).to.contain('2001-01-01T02:30', 'Expected to value to be equals to 2000-12-31');
    expect(await priceUpdatePage.getPriceInput()).to.eq('5', 'Expected price value to be equals to 5');

    await priceUpdatePage.save();
    expect(await priceUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await priceComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Price', async () => {
    const nbButtonsBeforeDelete = await priceComponentsPage.countDeleteButtons();
    await priceComponentsPage.clickOnLastDeleteButton();

    priceDeleteDialog = new PriceDeleteDialog();
    expect(await priceDeleteDialog.getDialogTitle()).to.eq('mallApp.price.delete.question');
    await priceDeleteDialog.clickOnConfirmButton();

    expect(await priceComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

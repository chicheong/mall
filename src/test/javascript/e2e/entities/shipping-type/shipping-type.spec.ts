import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ShippingTypeComponentsPage, ShippingTypeDeleteDialog, ShippingTypeUpdatePage } from './shipping-type.page-object';

const expect = chai.expect;

describe('ShippingType e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let shippingTypeComponentsPage: ShippingTypeComponentsPage;
  let shippingTypeUpdatePage: ShippingTypeUpdatePage;
  let shippingTypeDeleteDialog: ShippingTypeDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ShippingTypes', async () => {
    await navBarPage.goToEntity('shipping-type');
    shippingTypeComponentsPage = new ShippingTypeComponentsPage();
    await browser.wait(ec.visibilityOf(shippingTypeComponentsPage.title), 5000);
    expect(await shippingTypeComponentsPage.getTitle()).to.eq('mallApp.shippingType.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(shippingTypeComponentsPage.entities), ec.visibilityOf(shippingTypeComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ShippingType page', async () => {
    await shippingTypeComponentsPage.clickOnCreateButton();
    shippingTypeUpdatePage = new ShippingTypeUpdatePage();
    expect(await shippingTypeUpdatePage.getPageTitle()).to.eq('mallApp.shippingType.home.createOrEditLabel');
    await shippingTypeUpdatePage.cancel();
  });

  it('should create and save ShippingTypes', async () => {
    const nbButtonsBeforeCreate = await shippingTypeComponentsPage.countDeleteButtons();

    await shippingTypeComponentsPage.clickOnCreateButton();

    await promise.all([
      shippingTypeUpdatePage.setNameInput('name'),
      shippingTypeUpdatePage.setDescriptionInput('description'),
      shippingTypeUpdatePage.setPriceInput('5'),
      shippingTypeUpdatePage.currencySelectLastOption()
    ]);

    expect(await shippingTypeUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await shippingTypeUpdatePage.getDescriptionInput()).to.eq(
      'description',
      'Expected Description value to be equals to description'
    );
    expect(await shippingTypeUpdatePage.getPriceInput()).to.eq('5', 'Expected price value to be equals to 5');

    await shippingTypeUpdatePage.save();
    expect(await shippingTypeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await shippingTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ShippingType', async () => {
    const nbButtonsBeforeDelete = await shippingTypeComponentsPage.countDeleteButtons();
    await shippingTypeComponentsPage.clickOnLastDeleteButton();

    shippingTypeDeleteDialog = new ShippingTypeDeleteDialog();
    expect(await shippingTypeDeleteDialog.getDialogTitle()).to.eq('mallApp.shippingType.delete.question');
    await shippingTypeDeleteDialog.clickOnConfirmButton();

    expect(await shippingTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ShopComponentsPage, ShopDeleteDialog, ShopUpdatePage } from './shop.page-object';

const expect = chai.expect;

describe('Shop e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let shopComponentsPage: ShopComponentsPage;
  let shopUpdatePage: ShopUpdatePage;
  let shopDeleteDialog: ShopDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Shops', async () => {
    await navBarPage.goToEntity('shop');
    shopComponentsPage = new ShopComponentsPage();
    await browser.wait(ec.visibilityOf(shopComponentsPage.title), 5000);
    expect(await shopComponentsPage.getTitle()).to.eq('mallApp.shop.home.title');
    await browser.wait(ec.or(ec.visibilityOf(shopComponentsPage.entities), ec.visibilityOf(shopComponentsPage.noResult)), 1000);
  });

  it('should load create Shop page', async () => {
    await shopComponentsPage.clickOnCreateButton();
    shopUpdatePage = new ShopUpdatePage();
    expect(await shopUpdatePage.getPageTitle()).to.eq('mallApp.shop.home.createOrEditLabel');
    await shopUpdatePage.cancel();
  });

  it('should create and save Shops', async () => {
    const nbButtonsBeforeCreate = await shopComponentsPage.countDeleteButtons();

    await shopComponentsPage.clickOnCreateButton();

    await promise.all([
      shopUpdatePage.setCodeInput('code'),
      shopUpdatePage.setNameInput('name'),
      shopUpdatePage.setDescriptionInput('description'),
      shopUpdatePage.statusSelectLastOption(),
      shopUpdatePage.setCreatedByInput('createdBy'),
      shopUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      shopUpdatePage.setLastModifiedByInput('lastModifiedBy'),
      shopUpdatePage.setLastModifiedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
    ]);

    expect(await shopUpdatePage.getCodeInput()).to.eq('code', 'Expected Code value to be equals to code');
    expect(await shopUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await shopUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');
    expect(await shopUpdatePage.getCreatedByInput()).to.eq('createdBy', 'Expected CreatedBy value to be equals to createdBy');
    expect(await shopUpdatePage.getCreatedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected createdDate value to be equals to 2000-12-31'
    );
    expect(await shopUpdatePage.getLastModifiedByInput()).to.eq(
      'lastModifiedBy',
      'Expected LastModifiedBy value to be equals to lastModifiedBy'
    );
    expect(await shopUpdatePage.getLastModifiedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected lastModifiedDate value to be equals to 2000-12-31'
    );

    await shopUpdatePage.save();
    expect(await shopUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await shopComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Shop', async () => {
    const nbButtonsBeforeDelete = await shopComponentsPage.countDeleteButtons();
    await shopComponentsPage.clickOnLastDeleteButton();

    shopDeleteDialog = new ShopDeleteDialog();
    expect(await shopDeleteDialog.getDialogTitle()).to.eq('mallApp.shop.delete.question');
    await shopDeleteDialog.clickOnConfirmButton();

    expect(await shopComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

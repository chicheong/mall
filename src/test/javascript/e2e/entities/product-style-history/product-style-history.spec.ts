import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ProductStyleHistoryComponentsPage,
  ProductStyleHistoryDeleteDialog,
  ProductStyleHistoryUpdatePage
} from './product-style-history.page-object';

const expect = chai.expect;

describe('ProductStyleHistory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productStyleHistoryComponentsPage: ProductStyleHistoryComponentsPage;
  let productStyleHistoryUpdatePage: ProductStyleHistoryUpdatePage;
  let productStyleHistoryDeleteDialog: ProductStyleHistoryDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ProductStyleHistories', async () => {
    await navBarPage.goToEntity('product-style-history');
    productStyleHistoryComponentsPage = new ProductStyleHistoryComponentsPage();
    await browser.wait(ec.visibilityOf(productStyleHistoryComponentsPage.title), 5000);
    expect(await productStyleHistoryComponentsPage.getTitle()).to.eq('mallApp.productStyleHistory.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(productStyleHistoryComponentsPage.entities), ec.visibilityOf(productStyleHistoryComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ProductStyleHistory page', async () => {
    await productStyleHistoryComponentsPage.clickOnCreateButton();
    productStyleHistoryUpdatePage = new ProductStyleHistoryUpdatePage();
    expect(await productStyleHistoryUpdatePage.getPageTitle()).to.eq('mallApp.productStyleHistory.home.createOrEditLabel');
    await productStyleHistoryUpdatePage.cancel();
  });

  it('should create and save ProductStyleHistories', async () => {
    const nbButtonsBeforeCreate = await productStyleHistoryComponentsPage.countDeleteButtons();

    await productStyleHistoryComponentsPage.clickOnCreateButton();

    await promise.all([
      productStyleHistoryUpdatePage.setNameInput('name'),
      productStyleHistoryUpdatePage.setCodeInput('code'),
      productStyleHistoryUpdatePage.typeSelectLastOption(),
      productStyleHistoryUpdatePage.setCreatedByInput('createdBy'),
      productStyleHistoryUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
    ]);

    expect(await productStyleHistoryUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await productStyleHistoryUpdatePage.getCodeInput()).to.eq('code', 'Expected Code value to be equals to code');
    const selectedIsDefault = productStyleHistoryUpdatePage.getIsDefaultInput();
    if (await selectedIsDefault.isSelected()) {
      await productStyleHistoryUpdatePage.getIsDefaultInput().click();
      expect(await productStyleHistoryUpdatePage.getIsDefaultInput().isSelected(), 'Expected isDefault not to be selected').to.be.false;
    } else {
      await productStyleHistoryUpdatePage.getIsDefaultInput().click();
      expect(await productStyleHistoryUpdatePage.getIsDefaultInput().isSelected(), 'Expected isDefault to be selected').to.be.true;
    }
    expect(await productStyleHistoryUpdatePage.getCreatedByInput()).to.eq(
      'createdBy',
      'Expected CreatedBy value to be equals to createdBy'
    );
    expect(await productStyleHistoryUpdatePage.getCreatedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected createdDate value to be equals to 2000-12-31'
    );

    await productStyleHistoryUpdatePage.save();
    expect(await productStyleHistoryUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await productStyleHistoryComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last ProductStyleHistory', async () => {
    const nbButtonsBeforeDelete = await productStyleHistoryComponentsPage.countDeleteButtons();
    await productStyleHistoryComponentsPage.clickOnLastDeleteButton();

    productStyleHistoryDeleteDialog = new ProductStyleHistoryDeleteDialog();
    expect(await productStyleHistoryDeleteDialog.getDialogTitle()).to.eq('mallApp.productStyleHistory.delete.question');
    await productStyleHistoryDeleteDialog.clickOnConfirmButton();

    expect(await productStyleHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

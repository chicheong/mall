import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ProductItemHistoryComponentsPage,
  ProductItemHistoryDeleteDialog,
  ProductItemHistoryUpdatePage
} from './product-item-history.page-object';

const expect = chai.expect;

describe('ProductItemHistory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productItemHistoryComponentsPage: ProductItemHistoryComponentsPage;
  let productItemHistoryUpdatePage: ProductItemHistoryUpdatePage;
  let productItemHistoryDeleteDialog: ProductItemHistoryDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ProductItemHistories', async () => {
    await navBarPage.goToEntity('product-item-history');
    productItemHistoryComponentsPage = new ProductItemHistoryComponentsPage();
    await browser.wait(ec.visibilityOf(productItemHistoryComponentsPage.title), 5000);
    expect(await productItemHistoryComponentsPage.getTitle()).to.eq('mallApp.productItemHistory.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(productItemHistoryComponentsPage.entities), ec.visibilityOf(productItemHistoryComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ProductItemHistory page', async () => {
    await productItemHistoryComponentsPage.clickOnCreateButton();
    productItemHistoryUpdatePage = new ProductItemHistoryUpdatePage();
    expect(await productItemHistoryUpdatePage.getPageTitle()).to.eq('mallApp.productItemHistory.home.createOrEditLabel');
    await productItemHistoryUpdatePage.cancel();
  });

  it('should create and save ProductItemHistories', async () => {
    const nbButtonsBeforeCreate = await productItemHistoryComponentsPage.countDeleteButtons();

    await productItemHistoryComponentsPage.clickOnCreateButton();

    await promise.all([
      productItemHistoryUpdatePage.setCodeInput('code'),
      productItemHistoryUpdatePage.setQuantityInput('5'),
      productItemHistoryUpdatePage.currencySelectLastOption(),
      productItemHistoryUpdatePage.setPriceInput('5'),
      productItemHistoryUpdatePage.setCreatedByInput('createdBy'),
      productItemHistoryUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
    ]);

    expect(await productItemHistoryUpdatePage.getCodeInput()).to.eq('code', 'Expected Code value to be equals to code');
    const selectedIsDefault = productItemHistoryUpdatePage.getIsDefaultInput();
    if (await selectedIsDefault.isSelected()) {
      await productItemHistoryUpdatePage.getIsDefaultInput().click();
      expect(await productItemHistoryUpdatePage.getIsDefaultInput().isSelected(), 'Expected isDefault not to be selected').to.be.false;
    } else {
      await productItemHistoryUpdatePage.getIsDefaultInput().click();
      expect(await productItemHistoryUpdatePage.getIsDefaultInput().isSelected(), 'Expected isDefault to be selected').to.be.true;
    }
    expect(await productItemHistoryUpdatePage.getQuantityInput()).to.eq('5', 'Expected quantity value to be equals to 5');
    expect(await productItemHistoryUpdatePage.getPriceInput()).to.eq('5', 'Expected price value to be equals to 5');
    expect(await productItemHistoryUpdatePage.getCreatedByInput()).to.eq('createdBy', 'Expected CreatedBy value to be equals to createdBy');
    expect(await productItemHistoryUpdatePage.getCreatedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected createdDate value to be equals to 2000-12-31'
    );

    await productItemHistoryUpdatePage.save();
    expect(await productItemHistoryUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await productItemHistoryComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last ProductItemHistory', async () => {
    const nbButtonsBeforeDelete = await productItemHistoryComponentsPage.countDeleteButtons();
    await productItemHistoryComponentsPage.clickOnLastDeleteButton();

    productItemHistoryDeleteDialog = new ProductItemHistoryDeleteDialog();
    expect(await productItemHistoryDeleteDialog.getDialogTitle()).to.eq('mallApp.productItemHistory.delete.question');
    await productItemHistoryDeleteDialog.clickOnConfirmButton();

    expect(await productItemHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

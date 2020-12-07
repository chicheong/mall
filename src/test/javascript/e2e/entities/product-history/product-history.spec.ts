import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProductHistoryComponentsPage, ProductHistoryDeleteDialog, ProductHistoryUpdatePage } from './product-history.page-object';

const expect = chai.expect;

describe('ProductHistory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productHistoryComponentsPage: ProductHistoryComponentsPage;
  let productHistoryUpdatePage: ProductHistoryUpdatePage;
  let productHistoryDeleteDialog: ProductHistoryDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ProductHistories', async () => {
    await navBarPage.goToEntity('product-history');
    productHistoryComponentsPage = new ProductHistoryComponentsPage();
    await browser.wait(ec.visibilityOf(productHistoryComponentsPage.title), 5000);
    expect(await productHistoryComponentsPage.getTitle()).to.eq('mallApp.productHistory.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(productHistoryComponentsPage.entities), ec.visibilityOf(productHistoryComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ProductHistory page', async () => {
    await productHistoryComponentsPage.clickOnCreateButton();
    productHistoryUpdatePage = new ProductHistoryUpdatePage();
    expect(await productHistoryUpdatePage.getPageTitle()).to.eq('mallApp.productHistory.home.createOrEditLabel');
    await productHistoryUpdatePage.cancel();
  });

  it('should create and save ProductHistories', async () => {
    const nbButtonsBeforeCreate = await productHistoryComponentsPage.countDeleteButtons();

    await productHistoryComponentsPage.clickOnCreateButton();

    await promise.all([
      productHistoryUpdatePage.setProductIdInput('5'),
      productHistoryUpdatePage.setNameInput('name'),
      productHistoryUpdatePage.setCodeInput('code'),
      productHistoryUpdatePage.setBrandInput('brand'),
      productHistoryUpdatePage.setDescriptionInput('description'),
      productHistoryUpdatePage.setContentInput('content'),
      productHistoryUpdatePage.setRemarkInput('remark'),
      productHistoryUpdatePage.statusSelectLastOption(),
      productHistoryUpdatePage.setCreatedByInput('createdBy'),
      productHistoryUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
    ]);

    expect(await productHistoryUpdatePage.getProductIdInput()).to.eq('5', 'Expected productId value to be equals to 5');
    expect(await productHistoryUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await productHistoryUpdatePage.getCodeInput()).to.eq('code', 'Expected Code value to be equals to code');
    expect(await productHistoryUpdatePage.getBrandInput()).to.eq('brand', 'Expected Brand value to be equals to brand');
    expect(await productHistoryUpdatePage.getDescriptionInput()).to.eq(
      'description',
      'Expected Description value to be equals to description'
    );
    expect(await productHistoryUpdatePage.getContentInput()).to.eq('content', 'Expected Content value to be equals to content');
    expect(await productHistoryUpdatePage.getRemarkInput()).to.eq('remark', 'Expected Remark value to be equals to remark');
    expect(await productHistoryUpdatePage.getCreatedByInput()).to.eq('createdBy', 'Expected CreatedBy value to be equals to createdBy');
    expect(await productHistoryUpdatePage.getCreatedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected createdDate value to be equals to 2000-12-31'
    );

    await productHistoryUpdatePage.save();
    expect(await productHistoryUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await productHistoryComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last ProductHistory', async () => {
    const nbButtonsBeforeDelete = await productHistoryComponentsPage.countDeleteButtons();
    await productHistoryComponentsPage.clickOnLastDeleteButton();

    productHistoryDeleteDialog = new ProductHistoryDeleteDialog();
    expect(await productHistoryDeleteDialog.getDialogTitle()).to.eq('mallApp.productHistory.delete.question');
    await productHistoryDeleteDialog.clickOnConfirmButton();

    expect(await productHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

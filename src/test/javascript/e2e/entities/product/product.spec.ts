import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProductComponentsPage, ProductDeleteDialog, ProductUpdatePage } from './product.page-object';

const expect = chai.expect;

describe('Product e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productComponentsPage: ProductComponentsPage;
  let productUpdatePage: ProductUpdatePage;
  let productDeleteDialog: ProductDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Products', async () => {
    await navBarPage.goToEntity('product');
    productComponentsPage = new ProductComponentsPage();
    await browser.wait(ec.visibilityOf(productComponentsPage.title), 5000);
    expect(await productComponentsPage.getTitle()).to.eq('mallApp.product.home.title');
    await browser.wait(ec.or(ec.visibilityOf(productComponentsPage.entities), ec.visibilityOf(productComponentsPage.noResult)), 1000);
  });

  it('should load create Product page', async () => {
    await productComponentsPage.clickOnCreateButton();
    productUpdatePage = new ProductUpdatePage();
    expect(await productUpdatePage.getPageTitle()).to.eq('mallApp.product.home.createOrEditLabel');
    await productUpdatePage.cancel();
  });

  it('should create and save Products', async () => {
    const nbButtonsBeforeCreate = await productComponentsPage.countDeleteButtons();

    await productComponentsPage.clickOnCreateButton();

    await promise.all([
      productUpdatePage.setNameInput('name'),
      productUpdatePage.setCodeInput('code'),
      productUpdatePage.setBrandInput('brand'),
      productUpdatePage.setDescriptionInput('description'),
      productUpdatePage.setContentInput('content'),
      productUpdatePage.setRemarkInput('remark'),
      productUpdatePage.statusSelectLastOption(),
      productUpdatePage.setCreatedByInput('createdBy'),
      productUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      productUpdatePage.setLastModifiedByInput('lastModifiedBy'),
      productUpdatePage.setLastModifiedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      productUpdatePage.shopSelectLastOption()
    ]);

    expect(await productUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await productUpdatePage.getCodeInput()).to.eq('code', 'Expected Code value to be equals to code');
    expect(await productUpdatePage.getBrandInput()).to.eq('brand', 'Expected Brand value to be equals to brand');
    expect(await productUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');
    expect(await productUpdatePage.getContentInput()).to.eq('content', 'Expected Content value to be equals to content');
    expect(await productUpdatePage.getRemarkInput()).to.eq('remark', 'Expected Remark value to be equals to remark');
    expect(await productUpdatePage.getCreatedByInput()).to.eq('createdBy', 'Expected CreatedBy value to be equals to createdBy');
    expect(await productUpdatePage.getCreatedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected createdDate value to be equals to 2000-12-31'
    );
    expect(await productUpdatePage.getLastModifiedByInput()).to.eq(
      'lastModifiedBy',
      'Expected LastModifiedBy value to be equals to lastModifiedBy'
    );
    expect(await productUpdatePage.getLastModifiedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected lastModifiedDate value to be equals to 2000-12-31'
    );

    await productUpdatePage.save();
    expect(await productUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await productComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Product', async () => {
    const nbButtonsBeforeDelete = await productComponentsPage.countDeleteButtons();
    await productComponentsPage.clickOnLastDeleteButton();

    productDeleteDialog = new ProductDeleteDialog();
    expect(await productDeleteDialog.getDialogTitle()).to.eq('mallApp.product.delete.question');
    await productDeleteDialog.clickOnConfirmButton();

    expect(await productComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

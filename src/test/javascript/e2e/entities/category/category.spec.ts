import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CategoryComponentsPage, CategoryDeleteDialog, CategoryUpdatePage } from './category.page-object';

const expect = chai.expect;

describe('Category e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let categoryComponentsPage: CategoryComponentsPage;
  let categoryUpdatePage: CategoryUpdatePage;
  let categoryDeleteDialog: CategoryDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Categories', async () => {
    await navBarPage.goToEntity('category');
    categoryComponentsPage = new CategoryComponentsPage();
    await browser.wait(ec.visibilityOf(categoryComponentsPage.title), 5000);
    expect(await categoryComponentsPage.getTitle()).to.eq('mallApp.category.home.title');
    await browser.wait(ec.or(ec.visibilityOf(categoryComponentsPage.entities), ec.visibilityOf(categoryComponentsPage.noResult)), 1000);
  });

  it('should load create Category page', async () => {
    await categoryComponentsPage.clickOnCreateButton();
    categoryUpdatePage = new CategoryUpdatePage();
    expect(await categoryUpdatePage.getPageTitle()).to.eq('mallApp.category.home.createOrEditLabel');
    await categoryUpdatePage.cancel();
  });

  it('should create and save Categories', async () => {
    const nbButtonsBeforeCreate = await categoryComponentsPage.countDeleteButtons();

    await categoryComponentsPage.clickOnCreateButton();

    await promise.all([
      categoryUpdatePage.setNameInput('name'),
      categoryUpdatePage.setDescriptionInput('description'),
      categoryUpdatePage.statusSelectLastOption(),
      categoryUpdatePage.setCreatedByInput('createdBy'),
      categoryUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      categoryUpdatePage.setLastModifiedByInput('lastModifiedBy'),
      categoryUpdatePage.setLastModifiedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      categoryUpdatePage.parentSelectLastOption()
      // categoryUpdatePage.productSelectLastOption(),
    ]);

    expect(await categoryUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await categoryUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');
    expect(await categoryUpdatePage.getCreatedByInput()).to.eq('createdBy', 'Expected CreatedBy value to be equals to createdBy');
    expect(await categoryUpdatePage.getCreatedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected createdDate value to be equals to 2000-12-31'
    );
    expect(await categoryUpdatePage.getLastModifiedByInput()).to.eq(
      'lastModifiedBy',
      'Expected LastModifiedBy value to be equals to lastModifiedBy'
    );
    expect(await categoryUpdatePage.getLastModifiedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected lastModifiedDate value to be equals to 2000-12-31'
    );

    await categoryUpdatePage.save();
    expect(await categoryUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await categoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Category', async () => {
    const nbButtonsBeforeDelete = await categoryComponentsPage.countDeleteButtons();
    await categoryComponentsPage.clickOnLastDeleteButton();

    categoryDeleteDialog = new CategoryDeleteDialog();
    expect(await categoryDeleteDialog.getDialogTitle()).to.eq('mallApp.category.delete.question');
    await categoryDeleteDialog.clickOnConfirmButton();

    expect(await categoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

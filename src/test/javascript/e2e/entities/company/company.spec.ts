import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CompanyComponentsPage, CompanyDeleteDialog, CompanyUpdatePage } from './company.page-object';

const expect = chai.expect;

describe('Company e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let companyComponentsPage: CompanyComponentsPage;
  let companyUpdatePage: CompanyUpdatePage;
  let companyDeleteDialog: CompanyDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Companies', async () => {
    await navBarPage.goToEntity('company');
    companyComponentsPage = new CompanyComponentsPage();
    await browser.wait(ec.visibilityOf(companyComponentsPage.title), 5000);
    expect(await companyComponentsPage.getTitle()).to.eq('mallApp.company.home.title');
    await browser.wait(ec.or(ec.visibilityOf(companyComponentsPage.entities), ec.visibilityOf(companyComponentsPage.noResult)), 1000);
  });

  it('should load create Company page', async () => {
    await companyComponentsPage.clickOnCreateButton();
    companyUpdatePage = new CompanyUpdatePage();
    expect(await companyUpdatePage.getPageTitle()).to.eq('mallApp.company.home.createOrEditLabel');
    await companyUpdatePage.cancel();
  });

  it('should create and save Companies', async () => {
    const nbButtonsBeforeCreate = await companyComponentsPage.countDeleteButtons();

    await companyComponentsPage.clickOnCreateButton();

    await promise.all([
      companyUpdatePage.setCodeInput('code'),
      companyUpdatePage.setNameInput('name'),
      companyUpdatePage.statusSelectLastOption(),
      companyUpdatePage.parentSelectLastOption()
      // companyUpdatePage.departmentSelectLastOption(),
      // companyUpdatePage.officeSelectLastOption(),
    ]);

    expect(await companyUpdatePage.getCodeInput()).to.eq('code', 'Expected Code value to be equals to code');
    expect(await companyUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');

    await companyUpdatePage.save();
    expect(await companyUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await companyComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Company', async () => {
    const nbButtonsBeforeDelete = await companyComponentsPage.countDeleteButtons();
    await companyComponentsPage.clickOnLastDeleteButton();

    companyDeleteDialog = new CompanyDeleteDialog();
    expect(await companyDeleteDialog.getDialogTitle()).to.eq('mallApp.company.delete.question');
    await companyDeleteDialog.clickOnConfirmButton();

    expect(await companyComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

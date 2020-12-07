import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { OfficeComponentsPage, OfficeDeleteDialog, OfficeUpdatePage } from './office.page-object';

const expect = chai.expect;

describe('Office e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let officeComponentsPage: OfficeComponentsPage;
  let officeUpdatePage: OfficeUpdatePage;
  let officeDeleteDialog: OfficeDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Offices', async () => {
    await navBarPage.goToEntity('office');
    officeComponentsPage = new OfficeComponentsPage();
    await browser.wait(ec.visibilityOf(officeComponentsPage.title), 5000);
    expect(await officeComponentsPage.getTitle()).to.eq('mallApp.office.home.title');
    await browser.wait(ec.or(ec.visibilityOf(officeComponentsPage.entities), ec.visibilityOf(officeComponentsPage.noResult)), 1000);
  });

  it('should load create Office page', async () => {
    await officeComponentsPage.clickOnCreateButton();
    officeUpdatePage = new OfficeUpdatePage();
    expect(await officeUpdatePage.getPageTitle()).to.eq('mallApp.office.home.createOrEditLabel');
    await officeUpdatePage.cancel();
  });

  it('should create and save Offices', async () => {
    const nbButtonsBeforeCreate = await officeComponentsPage.countDeleteButtons();

    await officeComponentsPage.clickOnCreateButton();

    await promise.all([
      officeUpdatePage.setCodeInput('code'),
      officeUpdatePage.setNameInput('name'),
      officeUpdatePage.statusSelectLastOption(),
      officeUpdatePage.addressSelectLastOption()
    ]);

    expect(await officeUpdatePage.getCodeInput()).to.eq('code', 'Expected Code value to be equals to code');
    expect(await officeUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');

    await officeUpdatePage.save();
    expect(await officeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await officeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Office', async () => {
    const nbButtonsBeforeDelete = await officeComponentsPage.countDeleteButtons();
    await officeComponentsPage.clickOnLastDeleteButton();

    officeDeleteDialog = new OfficeDeleteDialog();
    expect(await officeDeleteDialog.getDialogTitle()).to.eq('mallApp.office.delete.question');
    await officeDeleteDialog.clickOnConfirmButton();

    expect(await officeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

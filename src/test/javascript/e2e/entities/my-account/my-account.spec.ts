import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MyAccountComponentsPage, MyAccountDeleteDialog, MyAccountUpdatePage } from './my-account.page-object';

const expect = chai.expect;

describe('MyAccount e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let myAccountComponentsPage: MyAccountComponentsPage;
  let myAccountUpdatePage: MyAccountUpdatePage;
  let myAccountDeleteDialog: MyAccountDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load MyAccounts', async () => {
    await navBarPage.goToEntity('my-account');
    myAccountComponentsPage = new MyAccountComponentsPage();
    await browser.wait(ec.visibilityOf(myAccountComponentsPage.title), 5000);
    expect(await myAccountComponentsPage.getTitle()).to.eq('mallApp.myAccount.home.title');
    await browser.wait(ec.or(ec.visibilityOf(myAccountComponentsPage.entities), ec.visibilityOf(myAccountComponentsPage.noResult)), 1000);
  });

  it('should load create MyAccount page', async () => {
    await myAccountComponentsPage.clickOnCreateButton();
    myAccountUpdatePage = new MyAccountUpdatePage();
    expect(await myAccountUpdatePage.getPageTitle()).to.eq('mallApp.myAccount.home.createOrEditLabel');
    await myAccountUpdatePage.cancel();
  });

  it('should create and save MyAccounts', async () => {
    const nbButtonsBeforeCreate = await myAccountComponentsPage.countDeleteButtons();

    await myAccountComponentsPage.clickOnCreateButton();

    await promise.all([
      myAccountUpdatePage.setBalanceInput('5'),
      myAccountUpdatePage.typeSelectLastOption(),
      myAccountUpdatePage.companySelectLastOption(),
      myAccountUpdatePage.departmentSelectLastOption(),
      myAccountUpdatePage.officeSelectLastOption()
      // myAccountUpdatePage.shopSelectLastOption(),
    ]);

    expect(await myAccountUpdatePage.getBalanceInput()).to.eq('5', 'Expected balance value to be equals to 5');

    await myAccountUpdatePage.save();
    expect(await myAccountUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await myAccountComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last MyAccount', async () => {
    const nbButtonsBeforeDelete = await myAccountComponentsPage.countDeleteButtons();
    await myAccountComponentsPage.clickOnLastDeleteButton();

    myAccountDeleteDialog = new MyAccountDeleteDialog();
    expect(await myAccountDeleteDialog.getDialogTitle()).to.eq('mallApp.myAccount.delete.question');
    await myAccountDeleteDialog.clickOnConfirmButton();

    expect(await myAccountComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

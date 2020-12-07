import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MyStateComponentsPage, MyStateDeleteDialog, MyStateUpdatePage } from './my-state.page-object';

const expect = chai.expect;

describe('MyState e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let myStateComponentsPage: MyStateComponentsPage;
  let myStateUpdatePage: MyStateUpdatePage;
  let myStateDeleteDialog: MyStateDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load MyStates', async () => {
    await navBarPage.goToEntity('my-state');
    myStateComponentsPage = new MyStateComponentsPage();
    await browser.wait(ec.visibilityOf(myStateComponentsPage.title), 5000);
    expect(await myStateComponentsPage.getTitle()).to.eq('mallApp.myState.home.title');
    await browser.wait(ec.or(ec.visibilityOf(myStateComponentsPage.entities), ec.visibilityOf(myStateComponentsPage.noResult)), 1000);
  });

  it('should load create MyState page', async () => {
    await myStateComponentsPage.clickOnCreateButton();
    myStateUpdatePage = new MyStateUpdatePage();
    expect(await myStateUpdatePage.getPageTitle()).to.eq('mallApp.myState.home.createOrEditLabel');
    await myStateUpdatePage.cancel();
  });

  it('should create and save MyStates', async () => {
    const nbButtonsBeforeCreate = await myStateComponentsPage.countDeleteButtons();

    await myStateComponentsPage.clickOnCreateButton();

    await promise.all([
      myStateUpdatePage.setCodeInput('code'),
      myStateUpdatePage.setLabelInput('label'),
      myStateUpdatePage.setNameInput('name'),
      myStateUpdatePage.countrySelectLastOption()
    ]);

    expect(await myStateUpdatePage.getCodeInput()).to.eq('code', 'Expected Code value to be equals to code');
    expect(await myStateUpdatePage.getLabelInput()).to.eq('label', 'Expected Label value to be equals to label');
    expect(await myStateUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');

    await myStateUpdatePage.save();
    expect(await myStateUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await myStateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last MyState', async () => {
    const nbButtonsBeforeDelete = await myStateComponentsPage.countDeleteButtons();
    await myStateComponentsPage.clickOnLastDeleteButton();

    myStateDeleteDialog = new MyStateDeleteDialog();
    expect(await myStateDeleteDialog.getDialogTitle()).to.eq('mallApp.myState.delete.question');
    await myStateDeleteDialog.clickOnConfirmButton();

    expect(await myStateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

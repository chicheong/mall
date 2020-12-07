import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ContactComponentsPage, ContactDeleteDialog, ContactUpdatePage } from './contact.page-object';

const expect = chai.expect;

describe('Contact e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let contactComponentsPage: ContactComponentsPage;
  let contactUpdatePage: ContactUpdatePage;
  let contactDeleteDialog: ContactDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Contacts', async () => {
    await navBarPage.goToEntity('contact');
    contactComponentsPage = new ContactComponentsPage();
    await browser.wait(ec.visibilityOf(contactComponentsPage.title), 5000);
    expect(await contactComponentsPage.getTitle()).to.eq('mallApp.contact.home.title');
    await browser.wait(ec.or(ec.visibilityOf(contactComponentsPage.entities), ec.visibilityOf(contactComponentsPage.noResult)), 1000);
  });

  it('should load create Contact page', async () => {
    await contactComponentsPage.clickOnCreateButton();
    contactUpdatePage = new ContactUpdatePage();
    expect(await contactUpdatePage.getPageTitle()).to.eq('mallApp.contact.home.createOrEditLabel');
    await contactUpdatePage.cancel();
  });

  it('should create and save Contacts', async () => {
    const nbButtonsBeforeCreate = await contactComponentsPage.countDeleteButtons();

    await contactComponentsPage.clickOnCreateButton();

    await promise.all([
      contactUpdatePage.setNameInput('name'),
      contactUpdatePage.setName2Input('name2'),
      contactUpdatePage.setPhoneNumInput('phoneNum'),
      contactUpdatePage.setPhoneNum2Input('phoneNum2'),
      contactUpdatePage.setEmailInput('email'),
      contactUpdatePage.setRemarkInput('remark'),
      contactUpdatePage.addressSelectLastOption()
    ]);

    expect(await contactUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await contactUpdatePage.getName2Input()).to.eq('name2', 'Expected Name2 value to be equals to name2');
    expect(await contactUpdatePage.getPhoneNumInput()).to.eq('phoneNum', 'Expected PhoneNum value to be equals to phoneNum');
    expect(await contactUpdatePage.getPhoneNum2Input()).to.eq('phoneNum2', 'Expected PhoneNum2 value to be equals to phoneNum2');
    expect(await contactUpdatePage.getEmailInput()).to.eq('email', 'Expected Email value to be equals to email');
    expect(await contactUpdatePage.getRemarkInput()).to.eq('remark', 'Expected Remark value to be equals to remark');

    await contactUpdatePage.save();
    expect(await contactUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await contactComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Contact', async () => {
    const nbButtonsBeforeDelete = await contactComponentsPage.countDeleteButtons();
    await contactComponentsPage.clickOnLastDeleteButton();

    contactDeleteDialog = new ContactDeleteDialog();
    expect(await contactDeleteDialog.getDialogTitle()).to.eq('mallApp.contact.delete.question');
    await contactDeleteDialog.clickOnConfirmButton();

    expect(await contactComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

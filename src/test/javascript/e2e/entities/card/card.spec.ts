import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CardComponentsPage, CardDeleteDialog, CardUpdatePage } from './card.page-object';

const expect = chai.expect;

describe('Card e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let cardComponentsPage: CardComponentsPage;
  let cardUpdatePage: CardUpdatePage;
  let cardDeleteDialog: CardDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Cards', async () => {
    await navBarPage.goToEntity('card');
    cardComponentsPage = new CardComponentsPage();
    await browser.wait(ec.visibilityOf(cardComponentsPage.title), 5000);
    expect(await cardComponentsPage.getTitle()).to.eq('mallApp.card.home.title');
    await browser.wait(ec.or(ec.visibilityOf(cardComponentsPage.entities), ec.visibilityOf(cardComponentsPage.noResult)), 1000);
  });

  it('should load create Card page', async () => {
    await cardComponentsPage.clickOnCreateButton();
    cardUpdatePage = new CardUpdatePage();
    expect(await cardUpdatePage.getPageTitle()).to.eq('mallApp.card.home.createOrEditLabel');
    await cardUpdatePage.cancel();
  });

  it('should create and save Cards', async () => {
    const nbButtonsBeforeCreate = await cardComponentsPage.countDeleteButtons();

    await cardComponentsPage.clickOnCreateButton();

    await promise.all([
      cardUpdatePage.setHolderNameInput('holderName'),
      cardUpdatePage.setCardNumberInput('cardNumber'),
      cardUpdatePage.setExpirationMonthInput('expirationMonth'),
      cardUpdatePage.setExpirationYearInput('expirationYear'),
      cardUpdatePage.setCvcInput('cvc'),
      cardUpdatePage.accountSelectLastOption()
    ]);

    expect(await cardUpdatePage.getHolderNameInput()).to.eq('holderName', 'Expected HolderName value to be equals to holderName');
    expect(await cardUpdatePage.getCardNumberInput()).to.eq('cardNumber', 'Expected CardNumber value to be equals to cardNumber');
    expect(await cardUpdatePage.getExpirationMonthInput()).to.eq(
      'expirationMonth',
      'Expected ExpirationMonth value to be equals to expirationMonth'
    );
    expect(await cardUpdatePage.getExpirationYearInput()).to.eq(
      'expirationYear',
      'Expected ExpirationYear value to be equals to expirationYear'
    );
    expect(await cardUpdatePage.getCvcInput()).to.eq('cvc', 'Expected Cvc value to be equals to cvc');

    await cardUpdatePage.save();
    expect(await cardUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await cardComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Card', async () => {
    const nbButtonsBeforeDelete = await cardComponentsPage.countDeleteButtons();
    await cardComponentsPage.clickOnLastDeleteButton();

    cardDeleteDialog = new CardDeleteDialog();
    expect(await cardDeleteDialog.getDialogTitle()).to.eq('mallApp.card.delete.question');
    await cardDeleteDialog.clickOnConfirmButton();

    expect(await cardComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

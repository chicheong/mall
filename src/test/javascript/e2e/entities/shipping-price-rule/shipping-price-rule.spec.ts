import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ShippingPriceRuleComponentsPage,
  ShippingPriceRuleDeleteDialog,
  ShippingPriceRuleUpdatePage
} from './shipping-price-rule.page-object';

const expect = chai.expect;

describe('ShippingPriceRule e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let shippingPriceRuleComponentsPage: ShippingPriceRuleComponentsPage;
  let shippingPriceRuleUpdatePage: ShippingPriceRuleUpdatePage;
  let shippingPriceRuleDeleteDialog: ShippingPriceRuleDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ShippingPriceRules', async () => {
    await navBarPage.goToEntity('shipping-price-rule');
    shippingPriceRuleComponentsPage = new ShippingPriceRuleComponentsPage();
    await browser.wait(ec.visibilityOf(shippingPriceRuleComponentsPage.title), 5000);
    expect(await shippingPriceRuleComponentsPage.getTitle()).to.eq('mallApp.shippingPriceRule.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(shippingPriceRuleComponentsPage.entities), ec.visibilityOf(shippingPriceRuleComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ShippingPriceRule page', async () => {
    await shippingPriceRuleComponentsPage.clickOnCreateButton();
    shippingPriceRuleUpdatePage = new ShippingPriceRuleUpdatePage();
    expect(await shippingPriceRuleUpdatePage.getPageTitle()).to.eq('mallApp.shippingPriceRule.home.createOrEditLabel');
    await shippingPriceRuleUpdatePage.cancel();
  });

  it('should create and save ShippingPriceRules', async () => {
    const nbButtonsBeforeCreate = await shippingPriceRuleComponentsPage.countDeleteButtons();

    await shippingPriceRuleComponentsPage.clickOnCreateButton();

    await promise.all([
      shippingPriceRuleUpdatePage.typeSelectLastOption(),
      shippingPriceRuleUpdatePage.setValueInput('5'),
      shippingPriceRuleUpdatePage.setPriceInput('5'),
      shippingPriceRuleUpdatePage.setSequenceInput('5'),
      shippingPriceRuleUpdatePage.shopSelectLastOption()
    ]);

    expect(await shippingPriceRuleUpdatePage.getValueInput()).to.eq('5', 'Expected value value to be equals to 5');
    expect(await shippingPriceRuleUpdatePage.getPriceInput()).to.eq('5', 'Expected price value to be equals to 5');
    expect(await shippingPriceRuleUpdatePage.getSequenceInput()).to.eq('5', 'Expected sequence value to be equals to 5');

    await shippingPriceRuleUpdatePage.save();
    expect(await shippingPriceRuleUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await shippingPriceRuleComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last ShippingPriceRule', async () => {
    const nbButtonsBeforeDelete = await shippingPriceRuleComponentsPage.countDeleteButtons();
    await shippingPriceRuleComponentsPage.clickOnLastDeleteButton();

    shippingPriceRuleDeleteDialog = new ShippingPriceRuleDeleteDialog();
    expect(await shippingPriceRuleDeleteDialog.getDialogTitle()).to.eq('mallApp.shippingPriceRule.delete.question');
    await shippingPriceRuleDeleteDialog.clickOnConfirmButton();

    expect(await shippingPriceRuleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

/* tslint:disable no-unused-expression */
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
    let shippingPriceRuleUpdatePage: ShippingPriceRuleUpdatePage;
    let shippingPriceRuleComponentsPage: ShippingPriceRuleComponentsPage;
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
            shippingPriceRuleUpdatePage.setTypeInput('type'),
            shippingPriceRuleUpdatePage.setValueInput('5'),
            shippingPriceRuleUpdatePage.setPriceInput('5'),
            shippingPriceRuleUpdatePage.shopSelectLastOption()
        ]);
        expect(await shippingPriceRuleUpdatePage.getTypeInput()).to.eq('type');
        expect(await shippingPriceRuleUpdatePage.getValueInput()).to.eq('5');
        expect(await shippingPriceRuleUpdatePage.getPriceInput()).to.eq('5');
        await shippingPriceRuleUpdatePage.save();
        expect(await shippingPriceRuleUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await shippingPriceRuleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
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

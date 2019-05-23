/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ShippingComponentsPage, ShippingDeleteDialog, ShippingUpdatePage } from './shipping.page-object';

const expect = chai.expect;

describe('Shipping e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let shippingUpdatePage: ShippingUpdatePage;
    let shippingComponentsPage: ShippingComponentsPage;
    let shippingDeleteDialog: ShippingDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Shippings', async () => {
        await navBarPage.goToEntity('shipping');
        shippingComponentsPage = new ShippingComponentsPage();
        await browser.wait(ec.visibilityOf(shippingComponentsPage.title), 5000);
        expect(await shippingComponentsPage.getTitle()).to.eq('mallApp.shipping.home.title');
    });

    it('should load create Shipping page', async () => {
        await shippingComponentsPage.clickOnCreateButton();
        shippingUpdatePage = new ShippingUpdatePage();
        expect(await shippingUpdatePage.getPageTitle()).to.eq('mallApp.shipping.home.createOrEditLabel');
        await shippingUpdatePage.cancel();
    });

    it('should create and save Shippings', async () => {
        const nbButtonsBeforeCreate = await shippingComponentsPage.countDeleteButtons();

        await shippingComponentsPage.clickOnCreateButton();
        await promise.all([
            shippingUpdatePage.setPriceInput('5'),
            shippingUpdatePage.currencySelectLastOption(),
            shippingUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            shippingUpdatePage.statusSelectLastOption(),
            shippingUpdatePage.typeSelectLastOption()
        ]);
        expect(await shippingUpdatePage.getPriceInput()).to.eq('5');
        expect(await shippingUpdatePage.getDateInput()).to.contain('2001-01-01T02:30');
        await shippingUpdatePage.save();
        expect(await shippingUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await shippingComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Shipping', async () => {
        const nbButtonsBeforeDelete = await shippingComponentsPage.countDeleteButtons();
        await shippingComponentsPage.clickOnLastDeleteButton();

        shippingDeleteDialog = new ShippingDeleteDialog();
        expect(await shippingDeleteDialog.getDialogTitle()).to.eq('mallApp.shipping.delete.question');
        await shippingDeleteDialog.clickOnConfirmButton();

        expect(await shippingComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

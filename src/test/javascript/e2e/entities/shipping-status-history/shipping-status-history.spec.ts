/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
    ShippingStatusHistoryComponentsPage,
    ShippingStatusHistoryDeleteDialog,
    ShippingStatusHistoryUpdatePage
} from './shipping-status-history.page-object';

const expect = chai.expect;

describe('ShippingStatusHistory e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let shippingStatusHistoryUpdatePage: ShippingStatusHistoryUpdatePage;
    let shippingStatusHistoryComponentsPage: ShippingStatusHistoryComponentsPage;
    let shippingStatusHistoryDeleteDialog: ShippingStatusHistoryDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load ShippingStatusHistories', async () => {
        await navBarPage.goToEntity('shipping-status-history');
        shippingStatusHistoryComponentsPage = new ShippingStatusHistoryComponentsPage();
        await browser.wait(ec.visibilityOf(shippingStatusHistoryComponentsPage.title), 5000);
        expect(await shippingStatusHistoryComponentsPage.getTitle()).to.eq('mallApp.shippingStatusHistory.home.title');
    });

    it('should load create ShippingStatusHistory page', async () => {
        await shippingStatusHistoryComponentsPage.clickOnCreateButton();
        shippingStatusHistoryUpdatePage = new ShippingStatusHistoryUpdatePage();
        expect(await shippingStatusHistoryUpdatePage.getPageTitle()).to.eq('mallApp.shippingStatusHistory.home.createOrEditLabel');
        await shippingStatusHistoryUpdatePage.cancel();
    });

    it('should create and save ShippingStatusHistories', async () => {
        const nbButtonsBeforeCreate = await shippingStatusHistoryComponentsPage.countDeleteButtons();

        await shippingStatusHistoryComponentsPage.clickOnCreateButton();
        await promise.all([
            shippingStatusHistoryUpdatePage.setEffectiveDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            shippingStatusHistoryUpdatePage.statusSelectLastOption(),
            shippingStatusHistoryUpdatePage.shippingSelectLastOption()
        ]);
        expect(await shippingStatusHistoryUpdatePage.getEffectiveDateInput()).to.contain('2001-01-01T02:30');
        await shippingStatusHistoryUpdatePage.save();
        expect(await shippingStatusHistoryUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await shippingStatusHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last ShippingStatusHistory', async () => {
        const nbButtonsBeforeDelete = await shippingStatusHistoryComponentsPage.countDeleteButtons();
        await shippingStatusHistoryComponentsPage.clickOnLastDeleteButton();

        shippingStatusHistoryDeleteDialog = new ShippingStatusHistoryDeleteDialog();
        expect(await shippingStatusHistoryDeleteDialog.getDialogTitle()).to.eq('mallApp.shippingStatusHistory.delete.question');
        await shippingStatusHistoryDeleteDialog.clickOnConfirmButton();

        expect(await shippingStatusHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

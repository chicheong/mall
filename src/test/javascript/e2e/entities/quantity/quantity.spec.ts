/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { QuantityComponentsPage, QuantityDeleteDialog, QuantityUpdatePage } from './quantity.page-object';

const expect = chai.expect;

describe('Quantity e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let quantityUpdatePage: QuantityUpdatePage;
    let quantityComponentsPage: QuantityComponentsPage;
    let quantityDeleteDialog: QuantityDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Quantities', async () => {
        await navBarPage.goToEntity('quantity');
        quantityComponentsPage = new QuantityComponentsPage();
        await browser.wait(ec.visibilityOf(quantityComponentsPage.title), 5000);
        expect(await quantityComponentsPage.getTitle()).to.eq('mallApp.quantity.home.title');
    });

    it('should load create Quantity page', async () => {
        await quantityComponentsPage.clickOnCreateButton();
        quantityUpdatePage = new QuantityUpdatePage();
        expect(await quantityUpdatePage.getPageTitle()).to.eq('mallApp.quantity.home.createOrEditLabel');
        await quantityUpdatePage.cancel();
    });

    it('should create and save Quantities', async () => {
        const nbButtonsBeforeCreate = await quantityComponentsPage.countDeleteButtons();

        await quantityComponentsPage.clickOnCreateButton();
        await promise.all([
            quantityUpdatePage.setFromInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            quantityUpdatePage.setToInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            quantityUpdatePage.setQuantityInput('5'),
            quantityUpdatePage.itemSelectLastOption()
        ]);
        expect(await quantityUpdatePage.getFromInput()).to.contain('2001-01-01T02:30');
        expect(await quantityUpdatePage.getToInput()).to.contain('2001-01-01T02:30');
        expect(await quantityUpdatePage.getQuantityInput()).to.eq('5');
        await quantityUpdatePage.save();
        expect(await quantityUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await quantityComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Quantity', async () => {
        const nbButtonsBeforeDelete = await quantityComponentsPage.countDeleteButtons();
        await quantityComponentsPage.clickOnLastDeleteButton();

        quantityDeleteDialog = new QuantityDeleteDialog();
        expect(await quantityDeleteDialog.getDialogTitle()).to.eq('mallApp.quantity.delete.question');
        await quantityDeleteDialog.clickOnConfirmButton();

        expect(await quantityComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

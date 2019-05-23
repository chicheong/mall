/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
    ProductStyleHistoryComponentsPage,
    ProductStyleHistoryDeleteDialog,
    ProductStyleHistoryUpdatePage
} from './product-style-history.page-object';

const expect = chai.expect;

describe('ProductStyleHistory e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let productStyleHistoryUpdatePage: ProductStyleHistoryUpdatePage;
    let productStyleHistoryComponentsPage: ProductStyleHistoryComponentsPage;
    let productStyleHistoryDeleteDialog: ProductStyleHistoryDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load ProductStyleHistories', async () => {
        await navBarPage.goToEntity('product-style-history');
        productStyleHistoryComponentsPage = new ProductStyleHistoryComponentsPage();
        await browser.wait(ec.visibilityOf(productStyleHistoryComponentsPage.title), 5000);
        expect(await productStyleHistoryComponentsPage.getTitle()).to.eq('mallApp.productStyleHistory.home.title');
    });

    it('should load create ProductStyleHistory page', async () => {
        await productStyleHistoryComponentsPage.clickOnCreateButton();
        productStyleHistoryUpdatePage = new ProductStyleHistoryUpdatePage();
        expect(await productStyleHistoryUpdatePage.getPageTitle()).to.eq('mallApp.productStyleHistory.home.createOrEditLabel');
        await productStyleHistoryUpdatePage.cancel();
    });

    it('should create and save ProductStyleHistories', async () => {
        const nbButtonsBeforeCreate = await productStyleHistoryComponentsPage.countDeleteButtons();

        await productStyleHistoryComponentsPage.clickOnCreateButton();
        await promise.all([
            productStyleHistoryUpdatePage.setNameInput('name'),
            productStyleHistoryUpdatePage.setCodeInput('code'),
            productStyleHistoryUpdatePage.typeSelectLastOption(),
            productStyleHistoryUpdatePage.setCreatedByInput('createdBy'),
            productStyleHistoryUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
        ]);
        expect(await productStyleHistoryUpdatePage.getNameInput()).to.eq('name');
        expect(await productStyleHistoryUpdatePage.getCodeInput()).to.eq('code');
        const selectedIsDefault = productStyleHistoryUpdatePage.getIsDefaultInput();
        if (await selectedIsDefault.isSelected()) {
            await productStyleHistoryUpdatePage.getIsDefaultInput().click();
            expect(await productStyleHistoryUpdatePage.getIsDefaultInput().isSelected()).to.be.false;
        } else {
            await productStyleHistoryUpdatePage.getIsDefaultInput().click();
            expect(await productStyleHistoryUpdatePage.getIsDefaultInput().isSelected()).to.be.true;
        }
        expect(await productStyleHistoryUpdatePage.getCreatedByInput()).to.eq('createdBy');
        expect(await productStyleHistoryUpdatePage.getCreatedDateInput()).to.contain('2001-01-01T02:30');
        await productStyleHistoryUpdatePage.save();
        expect(await productStyleHistoryUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await productStyleHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last ProductStyleHistory', async () => {
        const nbButtonsBeforeDelete = await productStyleHistoryComponentsPage.countDeleteButtons();
        await productStyleHistoryComponentsPage.clickOnLastDeleteButton();

        productStyleHistoryDeleteDialog = new ProductStyleHistoryDeleteDialog();
        expect(await productStyleHistoryDeleteDialog.getDialogTitle()).to.eq('mallApp.productStyleHistory.delete.question');
        await productStyleHistoryDeleteDialog.clickOnConfirmButton();

        expect(await productStyleHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

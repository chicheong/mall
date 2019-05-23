/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
    ProductItemHistoryComponentsPage,
    ProductItemHistoryDeleteDialog,
    ProductItemHistoryUpdatePage
} from './product-item-history.page-object';

const expect = chai.expect;

describe('ProductItemHistory e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let productItemHistoryUpdatePage: ProductItemHistoryUpdatePage;
    let productItemHistoryComponentsPage: ProductItemHistoryComponentsPage;
    let productItemHistoryDeleteDialog: ProductItemHistoryDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load ProductItemHistories', async () => {
        await navBarPage.goToEntity('product-item-history');
        productItemHistoryComponentsPage = new ProductItemHistoryComponentsPage();
        await browser.wait(ec.visibilityOf(productItemHistoryComponentsPage.title), 5000);
        expect(await productItemHistoryComponentsPage.getTitle()).to.eq('mallApp.productItemHistory.home.title');
    });

    it('should load create ProductItemHistory page', async () => {
        await productItemHistoryComponentsPage.clickOnCreateButton();
        productItemHistoryUpdatePage = new ProductItemHistoryUpdatePage();
        expect(await productItemHistoryUpdatePage.getPageTitle()).to.eq('mallApp.productItemHistory.home.createOrEditLabel');
        await productItemHistoryUpdatePage.cancel();
    });

    it('should create and save ProductItemHistories', async () => {
        const nbButtonsBeforeCreate = await productItemHistoryComponentsPage.countDeleteButtons();

        await productItemHistoryComponentsPage.clickOnCreateButton();
        await promise.all([
            productItemHistoryUpdatePage.setCodeInput('code'),
            productItemHistoryUpdatePage.setQuantityInput('5'),
            productItemHistoryUpdatePage.currencySelectLastOption(),
            productItemHistoryUpdatePage.setPriceInput('5'),
            productItemHistoryUpdatePage.setCreatedByInput('createdBy'),
            productItemHistoryUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
        ]);
        expect(await productItemHistoryUpdatePage.getCodeInput()).to.eq('code');
        const selectedIsDefault = productItemHistoryUpdatePage.getIsDefaultInput();
        if (await selectedIsDefault.isSelected()) {
            await productItemHistoryUpdatePage.getIsDefaultInput().click();
            expect(await productItemHistoryUpdatePage.getIsDefaultInput().isSelected()).to.be.false;
        } else {
            await productItemHistoryUpdatePage.getIsDefaultInput().click();
            expect(await productItemHistoryUpdatePage.getIsDefaultInput().isSelected()).to.be.true;
        }
        expect(await productItemHistoryUpdatePage.getQuantityInput()).to.eq('5');
        expect(await productItemHistoryUpdatePage.getPriceInput()).to.eq('5');
        expect(await productItemHistoryUpdatePage.getCreatedByInput()).to.eq('createdBy');
        expect(await productItemHistoryUpdatePage.getCreatedDateInput()).to.contain('2001-01-01T02:30');
        await productItemHistoryUpdatePage.save();
        expect(await productItemHistoryUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await productItemHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last ProductItemHistory', async () => {
        const nbButtonsBeforeDelete = await productItemHistoryComponentsPage.countDeleteButtons();
        await productItemHistoryComponentsPage.clickOnLastDeleteButton();

        productItemHistoryDeleteDialog = new ProductItemHistoryDeleteDialog();
        expect(await productItemHistoryDeleteDialog.getDialogTitle()).to.eq('mallApp.productItemHistory.delete.question');
        await productItemHistoryDeleteDialog.clickOnConfirmButton();

        expect(await productItemHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

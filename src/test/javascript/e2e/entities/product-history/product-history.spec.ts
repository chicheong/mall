/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProductHistoryComponentsPage, ProductHistoryDeleteDialog, ProductHistoryUpdatePage } from './product-history.page-object';

const expect = chai.expect;

describe('ProductHistory e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let productHistoryUpdatePage: ProductHistoryUpdatePage;
    let productHistoryComponentsPage: ProductHistoryComponentsPage;
    let productHistoryDeleteDialog: ProductHistoryDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load ProductHistories', async () => {
        await navBarPage.goToEntity('product-history');
        productHistoryComponentsPage = new ProductHistoryComponentsPage();
        await browser.wait(ec.visibilityOf(productHistoryComponentsPage.title), 5000);
        expect(await productHistoryComponentsPage.getTitle()).to.eq('mallApp.productHistory.home.title');
    });

    it('should load create ProductHistory page', async () => {
        await productHistoryComponentsPage.clickOnCreateButton();
        productHistoryUpdatePage = new ProductHistoryUpdatePage();
        expect(await productHistoryUpdatePage.getPageTitle()).to.eq('mallApp.productHistory.home.createOrEditLabel');
        await productHistoryUpdatePage.cancel();
    });

    it('should create and save ProductHistories', async () => {
        const nbButtonsBeforeCreate = await productHistoryComponentsPage.countDeleteButtons();

        await productHistoryComponentsPage.clickOnCreateButton();
        await promise.all([
            productHistoryUpdatePage.setProductIdInput('5'),
            productHistoryUpdatePage.setNameInput('name'),
            productHistoryUpdatePage.setCodeInput('code'),
            productHistoryUpdatePage.setBrandInput('brand'),
            productHistoryUpdatePage.setDescriptionInput('description'),
            productHistoryUpdatePage.setContentInput('content'),
            productHistoryUpdatePage.setRemarkInput('remark'),
            productHistoryUpdatePage.statusSelectLastOption(),
            productHistoryUpdatePage.setCreatedByInput('createdBy'),
            productHistoryUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
        ]);
        expect(await productHistoryUpdatePage.getProductIdInput()).to.eq('5');
        expect(await productHistoryUpdatePage.getNameInput()).to.eq('name');
        expect(await productHistoryUpdatePage.getCodeInput()).to.eq('code');
        expect(await productHistoryUpdatePage.getBrandInput()).to.eq('brand');
        expect(await productHistoryUpdatePage.getDescriptionInput()).to.eq('description');
        expect(await productHistoryUpdatePage.getContentInput()).to.eq('content');
        expect(await productHistoryUpdatePage.getRemarkInput()).to.eq('remark');
        expect(await productHistoryUpdatePage.getCreatedByInput()).to.eq('createdBy');
        expect(await productHistoryUpdatePage.getCreatedDateInput()).to.contain('2001-01-01T02:30');
        await productHistoryUpdatePage.save();
        expect(await productHistoryUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await productHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last ProductHistory', async () => {
        const nbButtonsBeforeDelete = await productHistoryComponentsPage.countDeleteButtons();
        await productHistoryComponentsPage.clickOnLastDeleteButton();

        productHistoryDeleteDialog = new ProductHistoryDeleteDialog();
        expect(await productHistoryDeleteDialog.getDialogTitle()).to.eq('mallApp.productHistory.delete.question');
        await productHistoryDeleteDialog.clickOnConfirmButton();

        expect(await productHistoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

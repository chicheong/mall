/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProductComponentsPage, ProductDeleteDialog, ProductUpdatePage } from './product.page-object';

const expect = chai.expect;

describe('Product e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let productUpdatePage: ProductUpdatePage;
    let productComponentsPage: ProductComponentsPage;
    let productDeleteDialog: ProductDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Products', async () => {
        await navBarPage.goToEntity('product');
        productComponentsPage = new ProductComponentsPage();
        await browser.wait(ec.visibilityOf(productComponentsPage.title), 5000);
        expect(await productComponentsPage.getTitle()).to.eq('mallApp.product.home.title');
    });

    it('should load create Product page', async () => {
        await productComponentsPage.clickOnCreateButton();
        productUpdatePage = new ProductUpdatePage();
        expect(await productUpdatePage.getPageTitle()).to.eq('mallApp.product.home.createOrEditLabel');
        await productUpdatePage.cancel();
    });

    it('should create and save Products', async () => {
        const nbButtonsBeforeCreate = await productComponentsPage.countDeleteButtons();

        await productComponentsPage.clickOnCreateButton();
        await promise.all([
            productUpdatePage.setNameInput('name'),
            productUpdatePage.setCodeInput('code'),
            productUpdatePage.setBrandInput('brand'),
            productUpdatePage.setDescriptionInput('description'),
            productUpdatePage.setContentInput('content'),
            productUpdatePage.setRemarkInput('remark'),
            productUpdatePage.statusSelectLastOption(),
            productUpdatePage.setCreatedByInput('createdBy'),
            productUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            productUpdatePage.setLastModifiedByInput('lastModifiedBy'),
            productUpdatePage.setLastModifiedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            productUpdatePage.shopSelectLastOption()
        ]);
        expect(await productUpdatePage.getNameInput()).to.eq('name');
        expect(await productUpdatePage.getCodeInput()).to.eq('code');
        expect(await productUpdatePage.getBrandInput()).to.eq('brand');
        expect(await productUpdatePage.getDescriptionInput()).to.eq('description');
        expect(await productUpdatePage.getContentInput()).to.eq('content');
        expect(await productUpdatePage.getRemarkInput()).to.eq('remark');
        expect(await productUpdatePage.getCreatedByInput()).to.eq('createdBy');
        expect(await productUpdatePage.getCreatedDateInput()).to.contain('2001-01-01T02:30');
        expect(await productUpdatePage.getLastModifiedByInput()).to.eq('lastModifiedBy');
        expect(await productUpdatePage.getLastModifiedDateInput()).to.contain('2001-01-01T02:30');
        await productUpdatePage.save();
        expect(await productUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await productComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Product', async () => {
        const nbButtonsBeforeDelete = await productComponentsPage.countDeleteButtons();
        await productComponentsPage.clickOnLastDeleteButton();

        productDeleteDialog = new ProductDeleteDialog();
        expect(await productDeleteDialog.getDialogTitle()).to.eq('mallApp.product.delete.question');
        await productDeleteDialog.clickOnConfirmButton();

        expect(await productComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

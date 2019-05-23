/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProductStyleComponentsPage, ProductStyleDeleteDialog, ProductStyleUpdatePage } from './product-style.page-object';

const expect = chai.expect;

describe('ProductStyle e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let productStyleUpdatePage: ProductStyleUpdatePage;
    let productStyleComponentsPage: ProductStyleComponentsPage;
    let productStyleDeleteDialog: ProductStyleDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load ProductStyles', async () => {
        await navBarPage.goToEntity('product-style');
        productStyleComponentsPage = new ProductStyleComponentsPage();
        await browser.wait(ec.visibilityOf(productStyleComponentsPage.title), 5000);
        expect(await productStyleComponentsPage.getTitle()).to.eq('mallApp.productStyle.home.title');
    });

    it('should load create ProductStyle page', async () => {
        await productStyleComponentsPage.clickOnCreateButton();
        productStyleUpdatePage = new ProductStyleUpdatePage();
        expect(await productStyleUpdatePage.getPageTitle()).to.eq('mallApp.productStyle.home.createOrEditLabel');
        await productStyleUpdatePage.cancel();
    });

    it('should create and save ProductStyles', async () => {
        const nbButtonsBeforeCreate = await productStyleComponentsPage.countDeleteButtons();

        await productStyleComponentsPage.clickOnCreateButton();
        await promise.all([
            productStyleUpdatePage.setNameInput('name'),
            productStyleUpdatePage.setCodeInput('code'),
            productStyleUpdatePage.typeSelectLastOption(),
            productStyleUpdatePage.productSelectLastOption()
        ]);
        expect(await productStyleUpdatePage.getNameInput()).to.eq('name');
        expect(await productStyleUpdatePage.getCodeInput()).to.eq('code');
        const selectedIsDefault = productStyleUpdatePage.getIsDefaultInput();
        if (await selectedIsDefault.isSelected()) {
            await productStyleUpdatePage.getIsDefaultInput().click();
            expect(await productStyleUpdatePage.getIsDefaultInput().isSelected()).to.be.false;
        } else {
            await productStyleUpdatePage.getIsDefaultInput().click();
            expect(await productStyleUpdatePage.getIsDefaultInput().isSelected()).to.be.true;
        }
        await productStyleUpdatePage.save();
        expect(await productStyleUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await productStyleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last ProductStyle', async () => {
        const nbButtonsBeforeDelete = await productStyleComponentsPage.countDeleteButtons();
        await productStyleComponentsPage.clickOnLastDeleteButton();

        productStyleDeleteDialog = new ProductStyleDeleteDialog();
        expect(await productStyleDeleteDialog.getDialogTitle()).to.eq('mallApp.productStyle.delete.question');
        await productStyleDeleteDialog.clickOnConfirmButton();

        expect(await productStyleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

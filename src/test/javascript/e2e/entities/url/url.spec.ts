/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { UrlComponentsPage, UrlDeleteDialog, UrlUpdatePage } from './url.page-object';

const expect = chai.expect;

describe('Url e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let urlUpdatePage: UrlUpdatePage;
    let urlComponentsPage: UrlComponentsPage;
    let urlDeleteDialog: UrlDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Urls', async () => {
        await navBarPage.goToEntity('url');
        urlComponentsPage = new UrlComponentsPage();
        await browser.wait(ec.visibilityOf(urlComponentsPage.title), 5000);
        expect(await urlComponentsPage.getTitle()).to.eq('mallApp.url.home.title');
    });

    it('should load create Url page', async () => {
        await urlComponentsPage.clickOnCreateButton();
        urlUpdatePage = new UrlUpdatePage();
        expect(await urlUpdatePage.getPageTitle()).to.eq('mallApp.url.home.createOrEditLabel');
        await urlUpdatePage.cancel();
    });

    it('should create and save Urls', async () => {
        const nbButtonsBeforeCreate = await urlComponentsPage.countDeleteButtons();

        await urlComponentsPage.clickOnCreateButton();
        await promise.all([
            urlUpdatePage.setEntityTypeInput('entityType'),
            urlUpdatePage.setEntityIdInput('5'),
            urlUpdatePage.setPathInput('path'),
            urlUpdatePage.setFileNameInput('fileName'),
            urlUpdatePage.setSequenceInput('5'),
            urlUpdatePage.setDescriptionInput('description'),
            urlUpdatePage.setCreatedByInput('createdBy'),
            urlUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            urlUpdatePage.setLastModifiedByInput('lastModifiedBy'),
            urlUpdatePage.setLastModifiedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
        ]);
        expect(await urlUpdatePage.getEntityTypeInput()).to.eq('entityType');
        expect(await urlUpdatePage.getEntityIdInput()).to.eq('5');
        expect(await urlUpdatePage.getPathInput()).to.eq('path');
        expect(await urlUpdatePage.getFileNameInput()).to.eq('fileName');
        expect(await urlUpdatePage.getSequenceInput()).to.eq('5');
        expect(await urlUpdatePage.getDescriptionInput()).to.eq('description');
        expect(await urlUpdatePage.getCreatedByInput()).to.eq('createdBy');
        expect(await urlUpdatePage.getCreatedDateInput()).to.contain('2001-01-01T02:30');
        expect(await urlUpdatePage.getLastModifiedByInput()).to.eq('lastModifiedBy');
        expect(await urlUpdatePage.getLastModifiedDateInput()).to.contain('2001-01-01T02:30');
        await urlUpdatePage.save();
        expect(await urlUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await urlComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Url', async () => {
        const nbButtonsBeforeDelete = await urlComponentsPage.countDeleteButtons();
        await urlComponentsPage.clickOnLastDeleteButton();

        urlDeleteDialog = new UrlDeleteDialog();
        expect(await urlDeleteDialog.getDialogTitle()).to.eq('mallApp.url.delete.question');
        await urlDeleteDialog.clickOnConfirmButton();

        expect(await urlComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { StateComponentsPage, StateDeleteDialog, StateUpdatePage } from './state.page-object';

const expect = chai.expect;

describe('State e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let stateUpdatePage: StateUpdatePage;
    let stateComponentsPage: StateComponentsPage;
    let stateDeleteDialog: StateDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load States', async () => {
        await navBarPage.goToEntity('state');
        stateComponentsPage = new StateComponentsPage();
        await browser.wait(ec.visibilityOf(stateComponentsPage.title), 5000);
        expect(await stateComponentsPage.getTitle()).to.eq('mallApp.state.home.title');
    });

    it('should load create State page', async () => {
        await stateComponentsPage.clickOnCreateButton();
        stateUpdatePage = new StateUpdatePage();
        expect(await stateUpdatePage.getPageTitle()).to.eq('mallApp.state.home.createOrEditLabel');
        await stateUpdatePage.cancel();
    });

    it('should create and save States', async () => {
        const nbButtonsBeforeCreate = await stateComponentsPage.countDeleteButtons();

        await stateComponentsPage.clickOnCreateButton();
        await promise.all([
            stateUpdatePage.setCodeInput('code'),
            stateUpdatePage.setLabelInput('label'),
            stateUpdatePage.setNameInput('name'),
            stateUpdatePage.countrySelectLastOption()
        ]);
        expect(await stateUpdatePage.getCodeInput()).to.eq('code');
        expect(await stateUpdatePage.getLabelInput()).to.eq('label');
        expect(await stateUpdatePage.getNameInput()).to.eq('name');
        await stateUpdatePage.save();
        expect(await stateUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await stateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last State', async () => {
        const nbButtonsBeforeDelete = await stateComponentsPage.countDeleteButtons();
        await stateComponentsPage.clickOnLastDeleteButton();

        stateDeleteDialog = new StateDeleteDialog();
        expect(await stateDeleteDialog.getDialogTitle()).to.eq('mallApp.state.delete.question');
        await stateDeleteDialog.clickOnConfirmButton();

        expect(await stateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

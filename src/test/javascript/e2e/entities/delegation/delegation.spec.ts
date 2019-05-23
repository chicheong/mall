/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { DelegationComponentsPage, DelegationDeleteDialog, DelegationUpdatePage } from './delegation.page-object';

const expect = chai.expect;

describe('Delegation e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let delegationUpdatePage: DelegationUpdatePage;
    let delegationComponentsPage: DelegationComponentsPage;
    let delegationDeleteDialog: DelegationDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Delegations', async () => {
        await navBarPage.goToEntity('delegation');
        delegationComponentsPage = new DelegationComponentsPage();
        await browser.wait(ec.visibilityOf(delegationComponentsPage.title), 5000);
        expect(await delegationComponentsPage.getTitle()).to.eq('mallApp.delegation.home.title');
    });

    it('should load create Delegation page', async () => {
        await delegationComponentsPage.clickOnCreateButton();
        delegationUpdatePage = new DelegationUpdatePage();
        expect(await delegationUpdatePage.getPageTitle()).to.eq('mallApp.delegation.home.createOrEditLabel');
        await delegationUpdatePage.cancel();
    });

    it('should create and save Delegations', async () => {
        const nbButtonsBeforeCreate = await delegationComponentsPage.countDeleteButtons();

        await delegationComponentsPage.clickOnCreateButton();
        await promise.all([
            delegationUpdatePage.setFromInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            delegationUpdatePage.setToInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            delegationUpdatePage.typeSelectLastOption(),
            delegationUpdatePage.setDelegateIdInput('delegateId'),
            delegationUpdatePage.statusSelectLastOption(),
            delegationUpdatePage.setCreatedByInput('createdBy'),
            delegationUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            delegationUpdatePage.setLastModifiedByInput('lastModifiedBy'),
            delegationUpdatePage.setLastModifiedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            delegationUpdatePage.accountSelectLastOption()
        ]);
        expect(await delegationUpdatePage.getFromInput()).to.contain('2001-01-01T02:30');
        expect(await delegationUpdatePage.getToInput()).to.contain('2001-01-01T02:30');
        expect(await delegationUpdatePage.getDelegateIdInput()).to.eq('delegateId');
        expect(await delegationUpdatePage.getCreatedByInput()).to.eq('createdBy');
        expect(await delegationUpdatePage.getCreatedDateInput()).to.contain('2001-01-01T02:30');
        expect(await delegationUpdatePage.getLastModifiedByInput()).to.eq('lastModifiedBy');
        expect(await delegationUpdatePage.getLastModifiedDateInput()).to.contain('2001-01-01T02:30');
        await delegationUpdatePage.save();
        expect(await delegationUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await delegationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Delegation', async () => {
        const nbButtonsBeforeDelete = await delegationComponentsPage.countDeleteButtons();
        await delegationComponentsPage.clickOnLastDeleteButton();

        delegationDeleteDialog = new DelegationDeleteDialog();
        expect(await delegationDeleteDialog.getDialogTitle()).to.eq('mallApp.delegation.delete.question');
        await delegationDeleteDialog.clickOnConfirmButton();

        expect(await delegationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PaymentComponentsPage, PaymentDeleteDialog, PaymentUpdatePage } from './payment.page-object';

const expect = chai.expect;

describe('Payment e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let paymentUpdatePage: PaymentUpdatePage;
    let paymentComponentsPage: PaymentComponentsPage;
    let paymentDeleteDialog: PaymentDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Payments', async () => {
        await navBarPage.goToEntity('payment');
        paymentComponentsPage = new PaymentComponentsPage();
        await browser.wait(ec.visibilityOf(paymentComponentsPage.title), 5000);
        expect(await paymentComponentsPage.getTitle()).to.eq('mallApp.payment.home.title');
    });

    it('should load create Payment page', async () => {
        await paymentComponentsPage.clickOnCreateButton();
        paymentUpdatePage = new PaymentUpdatePage();
        expect(await paymentUpdatePage.getPageTitle()).to.eq('mallApp.payment.home.createOrEditLabel');
        await paymentUpdatePage.cancel();
    });

    it('should create and save Payments', async () => {
        const nbButtonsBeforeCreate = await paymentComponentsPage.countDeleteButtons();

        await paymentComponentsPage.clickOnCreateButton();
        await promise.all([
            paymentUpdatePage.setAmountInput('5'),
            paymentUpdatePage.currencySelectLastOption(),
            paymentUpdatePage.typeSelectLastOption(),
            paymentUpdatePage.setRemarkInput('remark'),
            paymentUpdatePage.statusSelectLastOption()
        ]);
        expect(await paymentUpdatePage.getAmountInput()).to.eq('5');
        expect(await paymentUpdatePage.getRemarkInput()).to.eq('remark');
        await paymentUpdatePage.save();
        expect(await paymentUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await paymentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Payment', async () => {
        const nbButtonsBeforeDelete = await paymentComponentsPage.countDeleteButtons();
        await paymentComponentsPage.clickOnLastDeleteButton();

        paymentDeleteDialog = new PaymentDeleteDialog();
        expect(await paymentDeleteDialog.getDialogTitle()).to.eq('mallApp.payment.delete.question');
        await paymentDeleteDialog.clickOnConfirmButton();

        expect(await paymentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

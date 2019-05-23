/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PaymentCardComponentsPage, PaymentCardDeleteDialog, PaymentCardUpdatePage } from './payment-card.page-object';

const expect = chai.expect;

describe('PaymentCard e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let paymentCardUpdatePage: PaymentCardUpdatePage;
    let paymentCardComponentsPage: PaymentCardComponentsPage;
    let paymentCardDeleteDialog: PaymentCardDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load PaymentCards', async () => {
        await navBarPage.goToEntity('payment-card');
        paymentCardComponentsPage = new PaymentCardComponentsPage();
        await browser.wait(ec.visibilityOf(paymentCardComponentsPage.title), 5000);
        expect(await paymentCardComponentsPage.getTitle()).to.eq('mallApp.paymentCard.home.title');
    });

    it('should load create PaymentCard page', async () => {
        await paymentCardComponentsPage.clickOnCreateButton();
        paymentCardUpdatePage = new PaymentCardUpdatePage();
        expect(await paymentCardUpdatePage.getPageTitle()).to.eq('mallApp.paymentCard.home.createOrEditLabel');
        await paymentCardUpdatePage.cancel();
    });

    it('should create and save PaymentCards', async () => {
        const nbButtonsBeforeCreate = await paymentCardComponentsPage.countDeleteButtons();

        await paymentCardComponentsPage.clickOnCreateButton();
        await promise.all([
            paymentCardUpdatePage.setHolderNameInput('holderName'),
            paymentCardUpdatePage.setCardNumberInput('cardNumber'),
            paymentCardUpdatePage.setExpirationMonthInput('expirationMonth'),
            paymentCardUpdatePage.setExpirationYearInput('expirationYear'),
            paymentCardUpdatePage.setCvcInput('cvc')
        ]);
        expect(await paymentCardUpdatePage.getHolderNameInput()).to.eq('holderName');
        expect(await paymentCardUpdatePage.getCardNumberInput()).to.eq('cardNumber');
        expect(await paymentCardUpdatePage.getExpirationMonthInput()).to.eq('expirationMonth');
        expect(await paymentCardUpdatePage.getExpirationYearInput()).to.eq('expirationYear');
        expect(await paymentCardUpdatePage.getCvcInput()).to.eq('cvc');
        await paymentCardUpdatePage.save();
        expect(await paymentCardUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await paymentCardComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last PaymentCard', async () => {
        const nbButtonsBeforeDelete = await paymentCardComponentsPage.countDeleteButtons();
        await paymentCardComponentsPage.clickOnLastDeleteButton();

        paymentCardDeleteDialog = new PaymentCardDeleteDialog();
        expect(await paymentCardDeleteDialog.getDialogTitle()).to.eq('mallApp.paymentCard.delete.question');
        await paymentCardDeleteDialog.clickOnConfirmButton();

        expect(await paymentCardComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

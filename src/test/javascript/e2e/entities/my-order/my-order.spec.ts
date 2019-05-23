/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MyOrderComponentsPage, MyOrderDeleteDialog, MyOrderUpdatePage } from './my-order.page-object';

const expect = chai.expect;

describe('MyOrder e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let myOrderUpdatePage: MyOrderUpdatePage;
    let myOrderComponentsPage: MyOrderComponentsPage;
    let myOrderDeleteDialog: MyOrderDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load MyOrders', async () => {
        await navBarPage.goToEntity('my-order');
        myOrderComponentsPage = new MyOrderComponentsPage();
        await browser.wait(ec.visibilityOf(myOrderComponentsPage.title), 5000);
        expect(await myOrderComponentsPage.getTitle()).to.eq('mallApp.myOrder.home.title');
    });

    it('should load create MyOrder page', async () => {
        await myOrderComponentsPage.clickOnCreateButton();
        myOrderUpdatePage = new MyOrderUpdatePage();
        expect(await myOrderUpdatePage.getPageTitle()).to.eq('mallApp.myOrder.home.createOrEditLabel');
        await myOrderUpdatePage.cancel();
    });

    it('should create and save MyOrders', async () => {
        const nbButtonsBeforeCreate = await myOrderComponentsPage.countDeleteButtons();

        await myOrderComponentsPage.clickOnCreateButton();
        await promise.all([
            myOrderUpdatePage.setReceiverInput('receiver'),
            myOrderUpdatePage.setTotalInput('5'),
            myOrderUpdatePage.currencySelectLastOption(),
            myOrderUpdatePage.setContactNumInput('contactNum'),
            myOrderUpdatePage.setEmailInput('email'),
            myOrderUpdatePage.setRemarkInput('remark'),
            myOrderUpdatePage.statusSelectLastOption(),
            myOrderUpdatePage.shippingAddressSelectLastOption(),
            myOrderUpdatePage.billingAddressSelectLastOption(),
            myOrderUpdatePage.accountSelectLastOption()
        ]);
        expect(await myOrderUpdatePage.getReceiverInput()).to.eq('receiver');
        expect(await myOrderUpdatePage.getTotalInput()).to.eq('5');
        expect(await myOrderUpdatePage.getContactNumInput()).to.eq('contactNum');
        expect(await myOrderUpdatePage.getEmailInput()).to.eq('email');
        expect(await myOrderUpdatePage.getRemarkInput()).to.eq('remark');
        await myOrderUpdatePage.save();
        expect(await myOrderUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await myOrderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last MyOrder', async () => {
        const nbButtonsBeforeDelete = await myOrderComponentsPage.countDeleteButtons();
        await myOrderComponentsPage.clickOnLastDeleteButton();

        myOrderDeleteDialog = new MyOrderDeleteDialog();
        expect(await myOrderDeleteDialog.getDialogTitle()).to.eq('mallApp.myOrder.delete.question');
        await myOrderDeleteDialog.clickOnConfirmButton();

        expect(await myOrderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('OrderShop e2e test', () => {

    let navBarPage: NavBarPage;
    let orderShopDialogPage: OrderShopDialogPage;
    let orderShopComponentsPage: OrderShopComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load OrderShops', () => {
        navBarPage.goToEntity('order-shop');
        orderShopComponentsPage = new OrderShopComponentsPage();
        expect(orderShopComponentsPage.getTitle())
            .toMatch(/mallApp.orderShop.home.title/);

    });

    it('should load create OrderShop dialog', () => {
        orderShopComponentsPage.clickOnCreateButton();
        orderShopDialogPage = new OrderShopDialogPage();
        expect(orderShopDialogPage.getModalTitle())
            .toMatch(/mallApp.orderShop.home.createOrEditLabel/);
        orderShopDialogPage.close();
    });

    it('should create and save OrderShops', () => {
        orderShopComponentsPage.clickOnCreateButton();
        orderShopDialogPage.setTotalInput('5');
        expect(orderShopDialogPage.getTotalInput()).toMatch('5');
        orderShopDialogPage.currencySelectLastOption();
        orderShopDialogPage.setRemarkInput('remark');
        expect(orderShopDialogPage.getRemarkInput()).toMatch('remark');
        orderShopDialogPage.shopSelectLastOption();
        orderShopDialogPage.orderSelectLastOption();
        orderShopDialogPage.save();
        expect(orderShopDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class OrderShopComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-order-shop div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OrderShopDialogPage {
    modalTitle = element(by.css('h4#myOrderShopLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    totalInput = element(by.css('input#field_total'));
    currencySelect = element(by.css('select#field_currency'));
    remarkInput = element(by.css('input#field_remark'));
    shopSelect = element(by.css('select#field_shop'));
    orderSelect = element(by.css('select#field_order'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTotalInput = function(total) {
        this.totalInput.sendKeys(total);
    };

    getTotalInput = function() {
        return this.totalInput.getAttribute('value');
    };

    setCurrencySelect = function(currency) {
        this.currencySelect.sendKeys(currency);
    };

    getCurrencySelect = function() {
        return this.currencySelect.element(by.css('option:checked')).getText();
    };

    currencySelectLastOption = function() {
        this.currencySelect.all(by.tagName('option')).last().click();
    };
    setRemarkInput = function(remark) {
        this.remarkInput.sendKeys(remark);
    };

    getRemarkInput = function() {
        return this.remarkInput.getAttribute('value');
    };

    shopSelectLastOption = function() {
        this.shopSelect.all(by.tagName('option')).last().click();
    };

    shopSelectOption = function(option) {
        this.shopSelect.sendKeys(option);
    };

    getShopSelect = function() {
        return this.shopSelect;
    };

    getShopSelectedOption = function() {
        return this.shopSelect.element(by.css('option:checked')).getText();
    };

    orderSelectLastOption = function() {
        this.orderSelect.all(by.tagName('option')).last().click();
    };

    orderSelectOption = function(option) {
        this.orderSelect.sendKeys(option);
    };

    getOrderSelect = function() {
        return this.orderSelect;
    };

    getOrderSelectedOption = function() {
        return this.orderSelect.element(by.css('option:checked')).getText();
    };

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}

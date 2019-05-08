import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('OrderItem e2e test', () => {

    let navBarPage: NavBarPage;
    let orderItemDialogPage: OrderItemDialogPage;
    let orderItemComponentsPage: OrderItemComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load OrderItems', () => {
        navBarPage.goToEntity('order-item');
        orderItemComponentsPage = new OrderItemComponentsPage();
        expect(orderItemComponentsPage.getTitle())
            .toMatch(/mallApp.orderItem.home.title/);

    });

    it('should load create OrderItem dialog', () => {
        orderItemComponentsPage.clickOnCreateButton();
        orderItemDialogPage = new OrderItemDialogPage();
        expect(orderItemDialogPage.getModalTitle())
            .toMatch(/mallApp.orderItem.home.createOrEditLabel/);
        orderItemDialogPage.close();
    });

    it('should create and save OrderItems', () => {
        orderItemComponentsPage.clickOnCreateButton();
        orderItemDialogPage.setQuantityInput('5');
        expect(orderItemDialogPage.getQuantityInput()).toMatch('5');
        orderItemDialogPage.setPriceInput('5');
        expect(orderItemDialogPage.getPriceInput()).toMatch('5');
        orderItemDialogPage.currencySelectLastOption();
		orderItemDialogPage.productItemSelectLastOption();
        orderItemDialogPage.shopSelectLastOption();
        orderItemDialogPage.save();
        expect(orderItemDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class OrderItemComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-order-item div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OrderItemDialogPage {
    modalTitle = element(by.css('h4#myOrderItemLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    quantityInput = element(by.css('input#field_quantity'));
    priceInput = element(by.css('input#field_price'));
    currencySelect = element(by.css('select#field_currency'));
	productItemSelect = element(by.css('select#field_productItem'));
    shopSelect = element(by.css('select#field_shop'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setQuantityInput = function(quantity) {
        this.quantityInput.sendKeys(quantity);
    };

    getQuantityInput = function() {
        return this.quantityInput.getAttribute('value');
    };

    setPriceInput = function(price) {
        this.priceInput.sendKeys(price);
    };

    getPriceInput = function() {
        return this.priceInput.getAttribute('value');
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

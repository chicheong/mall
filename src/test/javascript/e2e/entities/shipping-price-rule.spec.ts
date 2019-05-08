import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ShippingPriceRule e2e test', () => {

    let navBarPage: NavBarPage;
    let shippingPriceRuleDialogPage: ShippingPriceRuleDialogPage;
    let shippingPriceRuleComponentsPage: ShippingPriceRuleComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ShippingPriceRules', () => {
        navBarPage.goToEntity('shipping-price-rule');
        shippingPriceRuleComponentsPage = new ShippingPriceRuleComponentsPage();
        expect(shippingPriceRuleComponentsPage.getTitle())
            .toMatch(/mallApp.shippingPriceRule.home.title/);

    });

    it('should load create ShippingPriceRule dialog', () => {
        shippingPriceRuleComponentsPage.clickOnCreateButton();
        shippingPriceRuleDialogPage = new ShippingPriceRuleDialogPage();
        expect(shippingPriceRuleDialogPage.getModalTitle())
            .toMatch(/mallApp.shippingPriceRule.home.createOrEditLabel/);
        shippingPriceRuleDialogPage.close();
    });

    it('should create and save ShippingPriceRules', () => {
        shippingPriceRuleComponentsPage.clickOnCreateButton();
        shippingPriceRuleDialogPage.setTypeInput('type');
        expect(shippingPriceRuleDialogPage.getTypeInput()).toMatch('type');
        shippingPriceRuleDialogPage.setValueInput('5');
        expect(shippingPriceRuleDialogPage.getValueInput()).toMatch('5');
        shippingPriceRuleDialogPage.setPriceInput('5');
        expect(shippingPriceRuleDialogPage.getPriceInput()).toMatch('5');
        shippingPriceRuleDialogPage.shopSelectLastOption();
        shippingPriceRuleDialogPage.save();
        expect(shippingPriceRuleDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ShippingPriceRuleComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-shipping-price-rule div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ShippingPriceRuleDialogPage {
    modalTitle = element(by.css('h4#myShippingPriceRuleLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    typeInput = element(by.css('input#field_type'));
    valueInput = element(by.css('input#field_value'));
    priceInput = element(by.css('input#field_price'));
    shopSelect = element(by.css('select#field_shop'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTypeInput = function(type) {
        this.typeInput.sendKeys(type);
    };

    getTypeInput = function() {
        return this.typeInput.getAttribute('value');
    };

    setValueInput = function(value) {
        this.valueInput.sendKeys(value);
    };

    getValueInput = function() {
        return this.valueInput.getAttribute('value');
    };

    setPriceInput = function(price) {
        this.priceInput.sendKeys(price);
    };

    getPriceInput = function() {
        return this.priceInput.getAttribute('value');
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

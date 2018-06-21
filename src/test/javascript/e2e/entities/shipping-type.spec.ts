import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ShippingType e2e test', () => {

    let navBarPage: NavBarPage;
    let shippingTypeDialogPage: ShippingTypeDialogPage;
    let shippingTypeComponentsPage: ShippingTypeComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ShippingTypes', () => {
        navBarPage.goToEntity('shipping-type');
        shippingTypeComponentsPage = new ShippingTypeComponentsPage();
        expect(shippingTypeComponentsPage.getTitle())
            .toMatch(/mallApp.shippingType.home.title/);

    });

    it('should load create ShippingType dialog', () => {
        shippingTypeComponentsPage.clickOnCreateButton();
        shippingTypeDialogPage = new ShippingTypeDialogPage();
        expect(shippingTypeDialogPage.getModalTitle())
            .toMatch(/mallApp.shippingType.home.createOrEditLabel/);
        shippingTypeDialogPage.close();
    });

    it('should create and save ShippingTypes', () => {
        shippingTypeComponentsPage.clickOnCreateButton();
        shippingTypeDialogPage.setNameInput('name');
        expect(shippingTypeDialogPage.getNameInput()).toMatch('name');
        shippingTypeDialogPage.setDescriptionInput('description');
        expect(shippingTypeDialogPage.getDescriptionInput()).toMatch('description');
        shippingTypeDialogPage.setPriceInput('5');
        expect(shippingTypeDialogPage.getPriceInput()).toMatch('5');
        shippingTypeDialogPage.currencySelectLastOption();
        shippingTypeDialogPage.save();
        expect(shippingTypeDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ShippingTypeComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-shipping-type div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ShippingTypeDialogPage {
    modalTitle = element(by.css('h4#myShippingTypeLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    priceInput = element(by.css('input#field_price'));
    currencySelect = element(by.css('select#field_currency'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setDescriptionInput = function(description) {
        this.descriptionInput.sendKeys(description);
    };

    getDescriptionInput = function() {
        return this.descriptionInput.getAttribute('value');
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

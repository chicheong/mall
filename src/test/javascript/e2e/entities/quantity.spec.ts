import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Quantity e2e test', () => {

    let navBarPage: NavBarPage;
    let quantityDialogPage: QuantityDialogPage;
    let quantityComponentsPage: QuantityComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Quantities', () => {
        navBarPage.goToEntity('quantity');
        quantityComponentsPage = new QuantityComponentsPage();
        expect(quantityComponentsPage.getTitle())
            .toMatch(/mallApp.quantity.home.title/);

    });

    it('should load create Quantity dialog', () => {
        quantityComponentsPage.clickOnCreateButton();
        quantityDialogPage = new QuantityDialogPage();
        expect(quantityDialogPage.getModalTitle())
            .toMatch(/mallApp.quantity.home.createOrEditLabel/);
        quantityDialogPage.close();
    });

    it('should create and save Quantities', () => {
        quantityComponentsPage.clickOnCreateButton();
        quantityDialogPage.setFromInput(12310020012301);
        expect(quantityDialogPage.getFromInput()).toMatch('2001-12-31T02:30');
        quantityDialogPage.setToInput(12310020012301);
        expect(quantityDialogPage.getToInput()).toMatch('2001-12-31T02:30');
        quantityDialogPage.setQuantityInput('5');
        expect(quantityDialogPage.getQuantityInput()).toMatch('5');
        quantityDialogPage.itemSelectLastOption();
        quantityDialogPage.save();
        expect(quantityDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class QuantityComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-quantity div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class QuantityDialogPage {
    modalTitle = element(by.css('h4#myQuantityLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    fromInput = element(by.css('input#field_from'));
    toInput = element(by.css('input#field_to'));
    quantityInput = element(by.css('input#field_quantity'));
    itemSelect = element(by.css('select#field_item'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setFromInput = function(from) {
        this.fromInput.sendKeys(from);
    };

    getFromInput = function() {
        return this.fromInput.getAttribute('value');
    };

    setToInput = function(to) {
        this.toInput.sendKeys(to);
    };

    getToInput = function() {
        return this.toInput.getAttribute('value');
    };

    setQuantityInput = function(quantity) {
        this.quantityInput.sendKeys(quantity);
    };

    getQuantityInput = function() {
        return this.quantityInput.getAttribute('value');
    };

    itemSelectLastOption = function() {
        this.itemSelect.all(by.tagName('option')).last().click();
    };

    itemSelectOption = function(option) {
        this.itemSelect.sendKeys(option);
    };

    getItemSelect = function() {
        return this.itemSelect;
    };

    getItemSelectedOption = function() {
        return this.itemSelect.element(by.css('option:checked')).getText();
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

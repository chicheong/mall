import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Address e2e test', () => {

    let navBarPage: NavBarPage;
    let addressDialogPage: AddressDialogPage;
    let addressComponentsPage: AddressComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Addresses', () => {
        navBarPage.goToEntity('address');
        addressComponentsPage = new AddressComponentsPage();
        expect(addressComponentsPage.getTitle())
            .toMatch(/mallApp.address.home.title/);

    });

    it('should load create Address dialog', () => {
        addressComponentsPage.clickOnCreateButton();
        addressDialogPage = new AddressDialogPage();
        expect(addressDialogPage.getModalTitle())
            .toMatch(/mallApp.address.home.createOrEditLabel/);
        addressDialogPage.close();
    });

    it('should create and save Addresses', () => {
        addressComponentsPage.clickOnCreateButton();
        addressDialogPage.setLine1Input('line1');
        expect(addressDialogPage.getLine1Input()).toMatch('line1');
        addressDialogPage.setLine2Input('line2');
        expect(addressDialogPage.getLine2Input()).toMatch('line2');
        addressDialogPage.setLine3Input('line3');
        expect(addressDialogPage.getLine3Input()).toMatch('line3');
        addressDialogPage.setLine4Input('line4');
        expect(addressDialogPage.getLine4Input()).toMatch('line4');
        addressDialogPage.setCityInput('city');
        expect(addressDialogPage.getCityInput()).toMatch('city');
        addressDialogPage.setPostalCodeInput('postalCode');
        expect(addressDialogPage.getPostalCodeInput()).toMatch('postalCode');
        addressDialogPage.countrySelectLastOption();
        addressDialogPage.stateSelectLastOption();
        addressDialogPage.save();
        expect(addressDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class AddressComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-address div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class AddressDialogPage {
    modalTitle = element(by.css('h4#myAddressLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    line1Input = element(by.css('input#field_line1'));
    line2Input = element(by.css('input#field_line2'));
    line3Input = element(by.css('input#field_line3'));
    line4Input = element(by.css('input#field_line4'));
    cityInput = element(by.css('input#field_city'));
    postalCodeInput = element(by.css('input#field_postalCode'));
    countrySelect = element(by.css('select#field_country'));
    stateSelect = element(by.css('select#field_state'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setLine1Input = function(line1) {
        this.line1Input.sendKeys(line1);
    };

    getLine1Input = function() {
        return this.line1Input.getAttribute('value');
    };

    setLine2Input = function(line2) {
        this.line2Input.sendKeys(line2);
    };

    getLine2Input = function() {
        return this.line2Input.getAttribute('value');
    };

    setLine3Input = function(line3) {
        this.line3Input.sendKeys(line3);
    };

    getLine3Input = function() {
        return this.line3Input.getAttribute('value');
    };

    setLine4Input = function(line4) {
        this.line4Input.sendKeys(line4);
    };

    getLine4Input = function() {
        return this.line4Input.getAttribute('value');
    };

    setCityInput = function(city) {
        this.cityInput.sendKeys(city);
    };

    getCityInput = function() {
        return this.cityInput.getAttribute('value');
    };

    setPostalCodeInput = function(postalCode) {
        this.postalCodeInput.sendKeys(postalCode);
    };

    getPostalCodeInput = function() {
        return this.postalCodeInput.getAttribute('value');
    };

    countrySelectLastOption = function() {
        this.countrySelect.all(by.tagName('option')).last().click();
    };

    countrySelectOption = function(option) {
        this.countrySelect.sendKeys(option);
    };

    getCountrySelect = function() {
        return this.countrySelect;
    };

    getCountrySelectedOption = function() {
        return this.countrySelect.element(by.css('option:checked')).getText();
    };

    stateSelectLastOption = function() {
        this.stateSelect.all(by.tagName('option')).last().click();
    };

    stateSelectOption = function(option) {
        this.stateSelect.sendKeys(option);
    };

    getStateSelect = function() {
        return this.stateSelect;
    };

    getStateSelectedOption = function() {
        return this.stateSelect.element(by.css('option:checked')).getText();
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

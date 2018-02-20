import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Country e2e test', () => {

    let navBarPage: NavBarPage;
    let countryDialogPage: CountryDialogPage;
    let countryComponentsPage: CountryComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Countries', () => {
        navBarPage.goToEntity('country');
        countryComponentsPage = new CountryComponentsPage();
        expect(countryComponentsPage.getTitle())
            .toMatch(/mallApp.country.home.title/);

    });

    it('should load create Country dialog', () => {
        countryComponentsPage.clickOnCreateButton();
        countryDialogPage = new CountryDialogPage();
        expect(countryDialogPage.getModalTitle())
            .toMatch(/mallApp.country.home.createOrEditLabel/);
        countryDialogPage.close();
    });

    it('should create and save Countries', () => {
        countryComponentsPage.clickOnCreateButton();
        countryDialogPage.setCodeInput('code');
        expect(countryDialogPage.getCodeInput()).toMatch('code');
        countryDialogPage.setLabelInput('label');
        expect(countryDialogPage.getLabelInput()).toMatch('label');
        countryDialogPage.setNumInput('num');
        expect(countryDialogPage.getNumInput()).toMatch('num');
        countryDialogPage.setNameInput('name');
        expect(countryDialogPage.getNameInput()).toMatch('name');
        countryDialogPage.save();
        expect(countryDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CountryComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-country div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CountryDialogPage {
    modalTitle = element(by.css('h4#myCountryLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    codeInput = element(by.css('input#field_code'));
    labelInput = element(by.css('input#field_label'));
    numInput = element(by.css('input#field_num'));
    nameInput = element(by.css('input#field_name'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setCodeInput = function(code) {
        this.codeInput.sendKeys(code);
    };

    getCodeInput = function() {
        return this.codeInput.getAttribute('value');
    };

    setLabelInput = function(label) {
        this.labelInput.sendKeys(label);
    };

    getLabelInput = function() {
        return this.labelInput.getAttribute('value');
    };

    setNumInput = function(num) {
        this.numInput.sendKeys(num);
    };

    getNumInput = function() {
        return this.numInput.getAttribute('value');
    };

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
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

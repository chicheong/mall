import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ShippingStatusHistory e2e test', () => {

    let navBarPage: NavBarPage;
    let shippingStatusHistoryDialogPage: ShippingStatusHistoryDialogPage;
    let shippingStatusHistoryComponentsPage: ShippingStatusHistoryComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ShippingStatusHistories', () => {
        navBarPage.goToEntity('shipping-status-history');
        shippingStatusHistoryComponentsPage = new ShippingStatusHistoryComponentsPage();
        expect(shippingStatusHistoryComponentsPage.getTitle())
            .toMatch(/mallApp.shippingStatusHistory.home.title/);

    });

    it('should load create ShippingStatusHistory dialog', () => {
        shippingStatusHistoryComponentsPage.clickOnCreateButton();
        shippingStatusHistoryDialogPage = new ShippingStatusHistoryDialogPage();
        expect(shippingStatusHistoryDialogPage.getModalTitle())
            .toMatch(/mallApp.shippingStatusHistory.home.createOrEditLabel/);
        shippingStatusHistoryDialogPage.close();
    });

    it('should create and save ShippingStatusHistories', () => {
        shippingStatusHistoryComponentsPage.clickOnCreateButton();
        shippingStatusHistoryDialogPage.setEffectiveDateInput(12310020012301);
        expect(shippingStatusHistoryDialogPage.getEffectiveDateInput()).toMatch('2001-12-31T02:30');
        shippingStatusHistoryDialogPage.statusSelectLastOption();
        shippingStatusHistoryDialogPage.shippingSelectLastOption();
        shippingStatusHistoryDialogPage.save();
        expect(shippingStatusHistoryDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ShippingStatusHistoryComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-shipping-status-history div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ShippingStatusHistoryDialogPage {
    modalTitle = element(by.css('h4#myShippingStatusHistoryLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    effectiveDateInput = element(by.css('input#field_effectiveDate'));
    statusSelect = element(by.css('select#field_status'));
    shippingSelect = element(by.css('select#field_shipping'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setEffectiveDateInput = function(effectiveDate) {
        this.effectiveDateInput.sendKeys(effectiveDate);
    };

    getEffectiveDateInput = function() {
        return this.effectiveDateInput.getAttribute('value');
    };

    setStatusSelect = function(status) {
        this.statusSelect.sendKeys(status);
    };

    getStatusSelect = function() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    };

    statusSelectLastOption = function() {
        this.statusSelect.all(by.tagName('option')).last().click();
    };
    shippingSelectLastOption = function() {
        this.shippingSelect.all(by.tagName('option')).last().click();
    };

    shippingSelectOption = function(option) {
        this.shippingSelect.sendKeys(option);
    };

    getShippingSelect = function() {
        return this.shippingSelect;
    };

    getShippingSelectedOption = function() {
        return this.shippingSelect.element(by.css('option:checked')).getText();
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

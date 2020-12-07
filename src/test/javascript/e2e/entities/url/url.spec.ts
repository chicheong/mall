import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { UrlComponentsPage, UrlDeleteDialog, UrlUpdatePage } from './url.page-object';

const expect = chai.expect;

describe('Url e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let urlComponentsPage: UrlComponentsPage;
  let urlUpdatePage: UrlUpdatePage;
  let urlDeleteDialog: UrlDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Urls', async () => {
    await navBarPage.goToEntity('url');
    urlComponentsPage = new UrlComponentsPage();
    await browser.wait(ec.visibilityOf(urlComponentsPage.title), 5000);
    expect(await urlComponentsPage.getTitle()).to.eq('mallApp.url.home.title');
    await browser.wait(ec.or(ec.visibilityOf(urlComponentsPage.entities), ec.visibilityOf(urlComponentsPage.noResult)), 1000);
  });

  it('should load create Url page', async () => {
    await urlComponentsPage.clickOnCreateButton();
    urlUpdatePage = new UrlUpdatePage();
    expect(await urlUpdatePage.getPageTitle()).to.eq('mallApp.url.home.createOrEditLabel');
    await urlUpdatePage.cancel();
  });

  it('should create and save Urls', async () => {
    const nbButtonsBeforeCreate = await urlComponentsPage.countDeleteButtons();

    await urlComponentsPage.clickOnCreateButton();

    await promise.all([
      urlUpdatePage.setEntityTypeInput('entityType'),
      urlUpdatePage.setEntityIdInput('5'),
      urlUpdatePage.setPathInput('path'),
      urlUpdatePage.setFileNameInput('fileName'),
      urlUpdatePage.setSequenceInput('5'),
      urlUpdatePage.setDescriptionInput('description'),
      urlUpdatePage.setCreatedByInput('createdBy'),
      urlUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      urlUpdatePage.setLastModifiedByInput('lastModifiedBy'),
      urlUpdatePage.setLastModifiedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
    ]);

    expect(await urlUpdatePage.getEntityTypeInput()).to.eq('entityType', 'Expected EntityType value to be equals to entityType');
    expect(await urlUpdatePage.getEntityIdInput()).to.eq('5', 'Expected entityId value to be equals to 5');
    expect(await urlUpdatePage.getPathInput()).to.eq('path', 'Expected Path value to be equals to path');
    expect(await urlUpdatePage.getFileNameInput()).to.eq('fileName', 'Expected FileName value to be equals to fileName');
    expect(await urlUpdatePage.getSequenceInput()).to.eq('5', 'Expected sequence value to be equals to 5');
    expect(await urlUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');
    expect(await urlUpdatePage.getCreatedByInput()).to.eq('createdBy', 'Expected CreatedBy value to be equals to createdBy');
    expect(await urlUpdatePage.getCreatedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected createdDate value to be equals to 2000-12-31'
    );
    expect(await urlUpdatePage.getLastModifiedByInput()).to.eq(
      'lastModifiedBy',
      'Expected LastModifiedBy value to be equals to lastModifiedBy'
    );
    expect(await urlUpdatePage.getLastModifiedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected lastModifiedDate value to be equals to 2000-12-31'
    );

    await urlUpdatePage.save();
    expect(await urlUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await urlComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Url', async () => {
    const nbButtonsBeforeDelete = await urlComponentsPage.countDeleteButtons();
    await urlComponentsPage.clickOnLastDeleteButton();

    urlDeleteDialog = new UrlDeleteDialog();
    expect(await urlDeleteDialog.getDialogTitle()).to.eq('mallApp.url.delete.question');
    await urlDeleteDialog.clickOnConfirmButton();

    expect(await urlComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

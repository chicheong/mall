/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { OfficeDialogComponent } from '../../../../../../main/webapp/app/entities/office/office-dialog.component';
import { OfficeService } from '../../../../../../main/webapp/app/entities/office/office.service';
import { Office } from '../../../../../../main/webapp/app/entities/office/office.model';
import { AddressService } from '../../../../../../main/webapp/app/entities/address';
import { CompanyService } from '../../../../../../main/webapp/app/entities/company';
import { DepartmentService } from '../../../../../../main/webapp/app/entities/department';

describe('Component Tests', () => {

    describe('Office Management Dialog Component', () => {
        let comp: OfficeDialogComponent;
        let fixture: ComponentFixture<OfficeDialogComponent>;
        let service: OfficeService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OfficeDialogComponent],
                providers: [
                    AddressService,
                    CompanyService,
                    DepartmentService,
                    OfficeService
                ]
            })
            .overrideTemplate(OfficeDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OfficeDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OfficeService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Office(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.office = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'officeListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Office();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.office = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'officeListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
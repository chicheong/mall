/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { DelegationDialogComponent } from '../../../../../../main/webapp/app/entities/delegation/delegation-dialog.component';
import { DelegationService } from '../../../../../../main/webapp/app/entities/delegation/delegation.service';
import { Delegation } from '../../../../../../main/webapp/app/entities/delegation/delegation.model';
import { MyAccountService } from '../../../../../../main/webapp/app/entities/my-account';

describe('Component Tests', () => {

    describe('Delegation Management Dialog Component', () => {
        let comp: DelegationDialogComponent;
        let fixture: ComponentFixture<DelegationDialogComponent>;
        let service: DelegationService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [DelegationDialogComponent],
                providers: [
                    MyAccountService,
                    DelegationService
                ]
            })
            .overrideTemplate(DelegationDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DelegationDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DelegationService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Delegation(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.delegation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'delegationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Delegation();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.delegation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'delegationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});

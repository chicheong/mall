/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { DelegationDeleteDialogComponent } from 'app/entities/delegation/delegation-delete-dialog.component';
import { DelegationService } from 'app/entities/delegation/delegation.service';

describe('Component Tests', () => {
    describe('Delegation Management Delete Component', () => {
        let comp: DelegationDeleteDialogComponent;
        let fixture: ComponentFixture<DelegationDeleteDialogComponent>;
        let service: DelegationService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [DelegationDeleteDialogComponent]
            })
                .overrideTemplate(DelegationDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(DelegationDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DelegationService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});

/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { MyStateDeleteDialogComponent } from 'app/entities/my-state/my-state-delete-dialog.component';
import { MyStateService } from 'app/entities/my-state/my-state.service';

describe('Component Tests', () => {
    describe('MyState Management Delete Component', () => {
        let comp: MyStateDeleteDialogComponent;
        let fixture: ComponentFixture<MyStateDeleteDialogComponent>;
        let service: MyStateService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [MyStateDeleteDialogComponent]
            })
                .overrideTemplate(MyStateDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MyStateDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyStateService);
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

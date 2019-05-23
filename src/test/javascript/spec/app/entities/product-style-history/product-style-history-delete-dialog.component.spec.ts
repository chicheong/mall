/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { ProductStyleHistoryDeleteDialogComponent } from 'app/entities/product-style-history/product-style-history-delete-dialog.component';
import { ProductStyleHistoryService } from 'app/entities/product-style-history/product-style-history.service';

describe('Component Tests', () => {
    describe('ProductStyleHistory Management Delete Component', () => {
        let comp: ProductStyleHistoryDeleteDialogComponent;
        let fixture: ComponentFixture<ProductStyleHistoryDeleteDialogComponent>;
        let service: ProductStyleHistoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductStyleHistoryDeleteDialogComponent]
            })
                .overrideTemplate(ProductStyleHistoryDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductStyleHistoryDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductStyleHistoryService);
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

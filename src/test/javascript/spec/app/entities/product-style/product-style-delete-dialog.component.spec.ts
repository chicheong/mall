/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { ProductStyleDeleteDialogComponent } from 'app/entities/product-style/product-style-delete-dialog.component';
import { ProductStyleService } from 'app/entities/product-style/product-style.service';

describe('Component Tests', () => {
    describe('ProductStyle Management Delete Component', () => {
        let comp: ProductStyleDeleteDialogComponent;
        let fixture: ComponentFixture<ProductStyleDeleteDialogComponent>;
        let service: ProductStyleService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductStyleDeleteDialogComponent]
            })
                .overrideTemplate(ProductStyleDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductStyleDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductStyleService);
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

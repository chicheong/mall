/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { ProductStyleHistoryDialogComponent } from '../../../../../../main/webapp/app/entities/product-style-history/product-style-history-dialog.component';
import { ProductStyleHistoryService } from '../../../../../../main/webapp/app/entities/product-style-history/product-style-history.service';
import { ProductStyleHistory } from '../../../../../../main/webapp/app/entities/product-style-history/product-style-history.model';

describe('Component Tests', () => {

    describe('ProductStyleHistory Management Dialog Component', () => {
        let comp: ProductStyleHistoryDialogComponent;
        let fixture: ComponentFixture<ProductStyleHistoryDialogComponent>;
        let service: ProductStyleHistoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductStyleHistoryDialogComponent],
                providers: [
                    ProductStyleHistoryService
                ]
            })
            .overrideTemplate(ProductStyleHistoryDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductStyleHistoryDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductStyleHistoryService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ProductStyleHistory(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.productStyleHistory = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'productStyleHistoryListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ProductStyleHistory();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.productStyleHistory = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'productStyleHistoryListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});

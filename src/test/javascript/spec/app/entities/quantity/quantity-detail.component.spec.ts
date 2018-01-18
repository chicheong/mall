/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { MallTestModule } from '../../../test.module';
import { QuantityDetailComponent } from '../../../../../../main/webapp/app/entities/quantity/quantity-detail.component';
import { QuantityService } from '../../../../../../main/webapp/app/entities/quantity/quantity.service';
import { Quantity } from '../../../../../../main/webapp/app/entities/quantity/quantity.model';

describe('Component Tests', () => {

    describe('Quantity Management Detail Component', () => {
        let comp: QuantityDetailComponent;
        let fixture: ComponentFixture<QuantityDetailComponent>;
        let service: QuantityService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [QuantityDetailComponent],
                providers: [
                    QuantityService
                ]
            })
            .overrideTemplate(QuantityDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuantityDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuantityService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Quantity(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.quantity).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

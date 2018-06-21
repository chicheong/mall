/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
import { ShippingTypeDetailComponent } from '../../../../../../main/webapp/app/entities/shipping-type/shipping-type-detail.component';
import { ShippingTypeService } from '../../../../../../main/webapp/app/entities/shipping-type/shipping-type.service';
import { ShippingType } from '../../../../../../main/webapp/app/entities/shipping-type/shipping-type.model';

describe('Component Tests', () => {

    describe('ShippingType Management Detail Component', () => {
        let comp: ShippingTypeDetailComponent;
        let fixture: ComponentFixture<ShippingTypeDetailComponent>;
        let service: ShippingTypeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingTypeDetailComponent],
                providers: [
                    ShippingTypeService
                ]
            })
            .overrideTemplate(ShippingTypeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShippingTypeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingTypeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ShippingType(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.shippingType).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

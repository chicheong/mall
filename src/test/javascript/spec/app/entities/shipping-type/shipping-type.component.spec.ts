/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { ShippingTypeComponent } from '../../../../../../main/webapp/app/entities/shipping-type/shipping-type.component';
import { ShippingTypeService } from '../../../../../../main/webapp/app/entities/shipping-type/shipping-type.service';
import { ShippingType } from '../../../../../../main/webapp/app/entities/shipping-type/shipping-type.model';

describe('Component Tests', () => {

    describe('ShippingType Management Component', () => {
        let comp: ShippingTypeComponent;
        let fixture: ComponentFixture<ShippingTypeComponent>;
        let service: ShippingTypeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingTypeComponent],
                providers: [
                    ShippingTypeService
                ]
            })
            .overrideTemplate(ShippingTypeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShippingTypeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingTypeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ShippingType(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.shippingTypes[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

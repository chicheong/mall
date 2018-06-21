/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { ShippingComponent } from '../../../../../../main/webapp/app/entities/shipping/shipping.component';
import { ShippingService } from '../../../../../../main/webapp/app/entities/shipping/shipping.service';
import { Shipping } from '../../../../../../main/webapp/app/entities/shipping/shipping.model';

describe('Component Tests', () => {

    describe('Shipping Management Component', () => {
        let comp: ShippingComponent;
        let fixture: ComponentFixture<ShippingComponent>;
        let service: ShippingService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingComponent],
                providers: [
                    ShippingService
                ]
            })
            .overrideTemplate(ShippingComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShippingComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Shipping(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.shippings[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

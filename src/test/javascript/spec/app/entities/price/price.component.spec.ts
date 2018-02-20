/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { PriceComponent } from '../../../../../../main/webapp/app/entities/price/price.component';
import { PriceService } from '../../../../../../main/webapp/app/entities/price/price.service';
import { Price } from '../../../../../../main/webapp/app/entities/price/price.model';

describe('Component Tests', () => {

    describe('Price Management Component', () => {
        let comp: PriceComponent;
        let fixture: ComponentFixture<PriceComponent>;
        let service: PriceService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PriceComponent],
                providers: [
                    PriceService
                ]
            })
            .overrideTemplate(PriceComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PriceComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PriceService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Price(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.prices[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

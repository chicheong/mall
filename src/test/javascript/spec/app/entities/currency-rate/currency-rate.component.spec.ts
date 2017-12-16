/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { Headers } from '@angular/http';

import { MallTestModule } from '../../../test.module';
import { CurrencyRateComponent } from '../../../../../../main/webapp/app/entities/currency-rate/currency-rate.component';
import { CurrencyRateService } from '../../../../../../main/webapp/app/entities/currency-rate/currency-rate.service';
import { CurrencyRate } from '../../../../../../main/webapp/app/entities/currency-rate/currency-rate.model';

describe('Component Tests', () => {

    describe('CurrencyRate Management Component', () => {
        let comp: CurrencyRateComponent;
        let fixture: ComponentFixture<CurrencyRateComponent>;
        let service: CurrencyRateService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [CurrencyRateComponent],
                providers: [
                    CurrencyRateService
                ]
            })
            .overrideTemplate(CurrencyRateComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CurrencyRateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CurrencyRateService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new CurrencyRate(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.currencyRates[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

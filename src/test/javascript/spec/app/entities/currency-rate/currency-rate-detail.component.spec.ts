/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { MallTestModule } from '../../../test.module';
import { CurrencyRateDetailComponent } from '../../../../../../main/webapp/app/entities/currency-rate/currency-rate-detail.component';
import { CurrencyRateService } from '../../../../../../main/webapp/app/entities/currency-rate/currency-rate.service';
import { CurrencyRate } from '../../../../../../main/webapp/app/entities/currency-rate/currency-rate.model';

describe('Component Tests', () => {

    describe('CurrencyRate Management Detail Component', () => {
        let comp: CurrencyRateDetailComponent;
        let fixture: ComponentFixture<CurrencyRateDetailComponent>;
        let service: CurrencyRateService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [CurrencyRateDetailComponent],
                providers: [
                    CurrencyRateService
                ]
            })
            .overrideTemplate(CurrencyRateDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CurrencyRateDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CurrencyRateService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new CurrencyRate(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.currencyRate).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

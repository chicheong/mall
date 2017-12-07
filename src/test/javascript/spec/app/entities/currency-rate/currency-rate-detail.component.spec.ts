/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
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
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CurrencyRateService,
                    JhiEventManager
                ]
            }).overrideTemplate(CurrencyRateDetailComponent, '')
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

            spyOn(service, 'find').and.returnValue(Observable.of(new CurrencyRate(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.currencyRate).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});

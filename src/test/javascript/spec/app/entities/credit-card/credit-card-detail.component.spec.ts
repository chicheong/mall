/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
import { CreditCardDetailComponent } from '../../../../../../main/webapp/app/entities/credit-card/credit-card-detail.component';
import { CreditCardService } from '../../../../../../main/webapp/app/entities/credit-card/credit-card.service';
import { CreditCard } from '../../../../../../main/webapp/app/entities/credit-card/credit-card.model';

describe('Component Tests', () => {

    describe('CreditCard Management Detail Component', () => {
        let comp: CreditCardDetailComponent;
        let fixture: ComponentFixture<CreditCardDetailComponent>;
        let service: CreditCardService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [CreditCardDetailComponent],
                providers: [
                    CreditCardService
                ]
            })
            .overrideTemplate(CreditCardDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CreditCardDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CreditCardService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CreditCard(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.creditCard).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

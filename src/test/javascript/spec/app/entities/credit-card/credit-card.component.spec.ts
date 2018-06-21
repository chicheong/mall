/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { CreditCardComponent } from '../../../../../../main/webapp/app/entities/credit-card/credit-card.component';
import { CreditCardService } from '../../../../../../main/webapp/app/entities/credit-card/credit-card.service';
import { CreditCard } from '../../../../../../main/webapp/app/entities/credit-card/credit-card.model';

describe('Component Tests', () => {

    describe('CreditCard Management Component', () => {
        let comp: CreditCardComponent;
        let fixture: ComponentFixture<CreditCardComponent>;
        let service: CreditCardService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [CreditCardComponent],
                providers: [
                    CreditCardService
                ]
            })
            .overrideTemplate(CreditCardComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CreditCardComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CreditCardService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new CreditCard(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.creditCards[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

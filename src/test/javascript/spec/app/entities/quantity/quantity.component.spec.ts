/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { Headers } from '@angular/http';

import { MallTestModule } from '../../../test.module';
import { QuantityComponent } from '../../../../../../main/webapp/app/entities/quantity/quantity.component';
import { QuantityService } from '../../../../../../main/webapp/app/entities/quantity/quantity.service';
import { Quantity } from '../../../../../../main/webapp/app/entities/quantity/quantity.model';

describe('Component Tests', () => {

    describe('Quantity Management Component', () => {
        let comp: QuantityComponent;
        let fixture: ComponentFixture<QuantityComponent>;
        let service: QuantityService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [QuantityComponent],
                providers: [
                    QuantityService
                ]
            })
            .overrideTemplate(QuantityComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuantityComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuantityService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Quantity(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.quantities[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { Headers } from '@angular/http';

import { MallTestModule } from '../../../test.module';
import { DelegationComponent } from '../../../../../../main/webapp/app/entities/delegation/delegation.component';
import { DelegationService } from '../../../../../../main/webapp/app/entities/delegation/delegation.service';
import { Delegation } from '../../../../../../main/webapp/app/entities/delegation/delegation.model';

describe('Component Tests', () => {

    describe('Delegation Management Component', () => {
        let comp: DelegationComponent;
        let fixture: ComponentFixture<DelegationComponent>;
        let service: DelegationService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [DelegationComponent],
                providers: [
                    DelegationService
                ]
            })
            .overrideTemplate(DelegationComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DelegationComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DelegationService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Delegation(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.delegations[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

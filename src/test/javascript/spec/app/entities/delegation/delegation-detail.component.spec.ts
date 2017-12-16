/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { MallTestModule } from '../../../test.module';
import { DelegationDetailComponent } from '../../../../../../main/webapp/app/entities/delegation/delegation-detail.component';
import { DelegationService } from '../../../../../../main/webapp/app/entities/delegation/delegation.service';
import { Delegation } from '../../../../../../main/webapp/app/entities/delegation/delegation.model';

describe('Component Tests', () => {

    describe('Delegation Management Detail Component', () => {
        let comp: DelegationDetailComponent;
        let fixture: ComponentFixture<DelegationDetailComponent>;
        let service: DelegationService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [DelegationDetailComponent],
                providers: [
                    DelegationService
                ]
            })
            .overrideTemplate(DelegationDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DelegationDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DelegationService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Delegation(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.delegation).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

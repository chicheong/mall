/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { MallTestModule } from '../../../test.module';
import { StateDetailComponent } from '../../../../../../main/webapp/app/entities/state/state-detail.component';
import { StateService } from '../../../../../../main/webapp/app/entities/state/state.service';
import { State } from '../../../../../../main/webapp/app/entities/state/state.model';

describe('Component Tests', () => {

    describe('State Management Detail Component', () => {
        let comp: StateDetailComponent;
        let fixture: ComponentFixture<StateDetailComponent>;
        let service: StateService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [StateDetailComponent],
                providers: [
                    StateService
                ]
            })
            .overrideTemplate(StateDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StateDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StateService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new State(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.state).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

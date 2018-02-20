/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
import { MyAccountDetailComponent } from '../../../../../../main/webapp/app/entities/my-account/my-account-detail.component';
import { MyAccountService } from '../../../../../../main/webapp/app/entities/my-account/my-account.service';
import { MyAccount } from '../../../../../../main/webapp/app/entities/my-account/my-account.model';

describe('Component Tests', () => {

    describe('MyAccount Management Detail Component', () => {
        let comp: MyAccountDetailComponent;
        let fixture: ComponentFixture<MyAccountDetailComponent>;
        let service: MyAccountService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [MyAccountDetailComponent],
                providers: [
                    MyAccountService
                ]
            })
            .overrideTemplate(MyAccountDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyAccountDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyAccountService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new MyAccount(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.myAccount).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

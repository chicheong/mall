/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { MyAccountDetailComponent } from 'app/entities/my-account/my-account-detail.component';
import { MyAccount } from 'app/shared/model/my-account.model';

describe('Component Tests', () => {
    describe('MyAccount Management Detail Component', () => {
        let comp: MyAccountDetailComponent;
        let fixture: ComponentFixture<MyAccountDetailComponent>;
        const route = ({ data: of({ myAccount: new MyAccount(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [MyAccountDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(MyAccountDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MyAccountDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.myAccount).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});

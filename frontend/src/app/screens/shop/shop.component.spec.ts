import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ShopComponent } from './shop.component';
import { HorseComponent } from '../../widget//horse/horse.component';
import { CommonService } from '../../model/services/common.service';
import { FormStringPipe, RaceDifficultyPipe } from '../../model/pipehelpers';
import { CurrencyPipe } from '@angular/common';


describe('ShopComponent', () => {
    let component: ShopComponent;
    let fixture: ComponentFixture<ShopComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [ ShopComponent, HorseComponent, FormStringPipe ],
            providers: [CurrencyPipe]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShopComponent);
        component = fixture.componentInstance;
        component.commonService.setInitialized();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../model/services/common.service';


import { RaceComponent } from './race.component';
import { RaceInstance, RaceState } from '../../model/raceinstance';
import { HorseComponent } from '../../widget/horse/horse.component';
import { CurrencyPipe } from '@angular/common';
import { FormStringPipe } from 'src/app/model/pipehelpers';

describe('RaceComponent', () => {
    let component: RaceComponent;
    let fixture: ComponentFixture<RaceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatRadioModule, RouterTestingModule, FormsModule],
            declarations: [ RaceComponent, HorseComponent, FormStringPipe],
            providers: [CurrencyPipe]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RaceComponent);
        component = fixture.componentInstance;
        component.commonService.setInitialized();
        component.commonService.gameInstance.playerOne.horses[0] = component.commonService.horsesInShop[0];
        component.commonService.gameInstance.playerOne.selectedHorseId = component.commonService.horsesInShop[0].id;
        component.activeRoute.snapshot.params['id'] = 1;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

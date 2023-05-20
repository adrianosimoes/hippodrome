import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormStringPipe, RaceDifficultyPipe } from '../../model/pipehelpers';

import { TrainingComponent } from './training.component';
import { CommonService } from '../../model/services/common.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';


describe('TrainingComponent', () => {
    let component: TrainingComponent;
    let fixture: ComponentFixture<TrainingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, FormsModule],
            declarations: [ TrainingComponent, FormStringPipe],
            providers: [CurrencyPipe]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrainingComponent);
        component = fixture.componentInstance;
        component.commonService.setInitialized();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

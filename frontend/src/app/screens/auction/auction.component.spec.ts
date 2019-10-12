import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormStringPipe, RaceDifficultyPipe } from '../../model/pipehelpers';

import { AuctionComponent } from './auction.component';
import { HorseComponent } from '../../widget//horse/horse.component';
import { CommonService } from '../../model/services/common.service';
import { FormsModule } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";


describe('AuctionComponent', () => {
  let component: AuctionComponent;
  let fixture: ComponentFixture<AuctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [ AuctionComponent, HorseComponent, FormStringPipe],
      providers: [CurrencyPipe, CommonService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionComponent);
    component = fixture.componentInstance;
    component.commonService.setInitialized();
    component.commonService.setAuctionHorse(component.commonService.getHorsesInShop()[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyHorseComponent } from './buy-horse.component';

describe('BuyHorseComponent', () => {
  let component: BuyHorseComponent;
  let fixture: ComponentFixture<BuyHorseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyHorseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyHorseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

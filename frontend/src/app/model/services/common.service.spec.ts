import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CurrencyPipe } from "@angular/common";

import { CommonService } from './common.service';
import { InitService } from "src/app/model/services/init.service";
import { GameConstants } from "src/app/model/services/gameconstants";
import { HorseForm } from "src/app/model/horse";

describe('CommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [RouterTestingModule],
      providers: [CommonService, CurrencyPipe]
    });
  });

  it('should be created', inject([CommonService], (service: CommonService) => {
    expect(service).toBeTruthy();
  }));
  
  
  it('Test Horse shop', inject([CommonService], (service: CommonService) => {
      expect(service.getHorsesInShop().length).toBe(7);
      expect(service.getHorsesInShop()[0].name).toBe("Bruce Steel")
      expect(service.getHorsesInShop()[0].speed).toBe(13);
      expect(service.getHorsesInShop()[0].endurance).toBe(17);
      expect(service.getHorsesInShop()[0].acceleration).toBe(12);
      //Horse should start with maxium stamina
      expect(service.getHorsesInShop()[0].staminaDisplay).toBe(0);
      
    }));
  
  it('Test race leagues and tracks are created', inject([CommonService], (service: CommonService) => { 
      expect(service.leagues.length).toBe(4);
      expect(service.leagues[0].name).toBe("Ungraded");
      expect(service.leagues[0].difficulty).toBe(2);
      expect(service.leagues[0].races.length).toBe(4);
      expect(service.getRace(1).name).toBe("Colwall Park");
      expect(service.getRace(1).difficulty).toBe(2);
      expect(service.getRace(1).distance).toBe(400);
      expect(service.getRace(1).color).toBe("#338833");
      
      expect(service.getRace(5).name).toBe("Aberystwyth");
      expect(service.getRace(5).difficulty).toBe(3);
      expect(service.getRace(5).distance).toBe(450);
      expect(service.getRace(5).color).toBe("#1fba1f");
      
  }));
  
  it('Test player to be created', inject([CommonService], (service: CommonService) => {
      expect(service.getGameInstance()).toBeDefined();
      expect(service.getGameInstance().initialized).toBeFalsy();
      
      //Current Date Bigger than 1st January 2018.
      expect(service.getGameInstance().date.getTime()).toBeGreaterThan(15147648000 * 100);
      
      expect(service.getPlayer()).toBeDefined();
      expect(service.getPlayer().name).toBe("");
      expect(service.getPlayer().money).toBe(GameConstants.INITIAL_MONEY);
     
  }));
  
  it('Test Buy Horse', inject([CommonService], (service: CommonService) => {
      expect(service.getPlayer().money).toBe(GameConstants.INITIAL_MONEY);
      let buyResult = service.addHorseToPlayer(service.getHorsesInShop()[2]);
      expect(buyResult).toBeTruthy();
      
      expect(service.getPlayer().money).toBe(GameConstants.INITIAL_MONEY - 2800);
      
      expect(service.getPlayer().horses.length).toBe(1);
      
      expect(service.getPlayer().horses[0].id).toBe(1);
      expect(service.getPlayer().horses[0].name).toBe("Sandra Flash");
      expect(service.getPlayer().horses[0].form).toBeGreaterThanOrEqual(HorseForm.BAD);
      expect(service.getPlayer().horses[0].form).toBeLessThanOrEqual(HorseForm.GOOD);
      expect(service.getPlayer().horses[0].owned).toBeTruthy();
      expect(service.getPlayer().selectedHorseId).toBe(1);

  }));
  
  it('Test not enoug money to buy Horse', inject([CommonService], (service: CommonService) => {
      expect(service.getPlayer().money).toBe(GameConstants.INITIAL_MONEY);
      let buyResult = service.addHorseToPlayer(service.getHorsesInShop()[5]);
      expect(buyResult).toBeFalsy();
      expect(service.getPlayer().money).toBe(GameConstants.INITIAL_MONEY);
      expect(service.getPlayer().horses.length).toBe(0);

  }));
});

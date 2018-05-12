import { Component } from '@angular/core';
import { Player } from './model/player';
import { GameInstance } from './model/gameinstance';
import { CommonService } from './model/common.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hippodrome';
  currPlayer: Player;
  currGame: GameInstance;
  public commonService;
  
  constructor(commService: CommonService) { this.commonService = commService;}

  
  ngOnInit() {
      this.currPlayer = this.commonService.getPlayer();
      this.currGame = this.commonService.getGameInstance();
  }
}

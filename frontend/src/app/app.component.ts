import { Component } from '@angular/core';
import { Player } from './model/player';
import { CommonService } from './model/common.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hippodrome';
  currPlayer: Player;
  
  constructor(private commonService: CommonService) { }

  
  ngOnInit() {
      this.currPlayer = this.commonService.getPlayer();
  }
}

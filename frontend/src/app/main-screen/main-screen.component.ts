import { Component, OnInit } from '@angular/core';
import { playerOne } from '../model/repository';


@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {
  currPlayer = playerOne;
  warningText: '';

  constructor() { }

  ngOnInit() {
  }
    
   gotoRace(): void {
       this.warningText = 'Not implemented yet';
    }

}

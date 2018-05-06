import { Component, OnInit } from '@angular/core';
import { playerOne, date } from '../../model/repository';


@Component({
    selector: 'app-main-screen',
    templateUrl: './main-screen.component.html',
    styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {
    currPlayer = playerOne;
    warningText: string = '';
    loading: boolean = false;
    currDate: Date = date;

    constructor() { }

    ngOnInit() {
    }

    gotoRace(): void {
        this.warningText = 'Not implemented yet';
    }
    
     skipDay(): void {
        this.loading = true;
        setTimeout(() => { this.loading = false;}, 400);
        this.currDate = new Date(this.currDate.getTime()+1000*60*60*24);
        this.currPlayer.horses[0].calculateForm();
    }

}

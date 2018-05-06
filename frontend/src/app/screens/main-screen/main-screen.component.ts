import { Component, OnInit } from '@angular/core';
import { Player } from '../../model/player';
import { CommonService } from '../../model/common.service';

@Component({
    selector: 'app-main-screen',
    templateUrl: './main-screen.component.html',
    styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {
    currPlayer: Player;
    currGame: GameInstance;
    warningText: string = '';
    loading: boolean = false;


    constructor(private commonService: CommonService) { }

    ngOnInit() {
        this.currPlayer = this.commonService.getPlayer();
        this.currGame = this.commonService.getGameInstance();
    }

    gotoRace(): void {
        this.warningText = 'Not implemented yet';
    }

    skipDay(): void {
        this.loading = true;
        setTimeout(() => { this.loading = false; }, 100);
        this.commonService.nextDay();
    }

}

import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { Player } from '../../model/player';
import { Utils } from '../../model/utils';

import { GameInstance } from '../../model/gameinstance';
import { CommonService } from '../../model/common.service';


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    currPlayer: Player;
    currGame: GameInstance;
    warningText: string = '';

    constructor(private router: Router, private commonService: CommonService) { }

    ngOnInit() {
        this.currPlayer = this.commonService.getPlayer();
        this.currGame = this.commonService.getGameInstance();
    }

    gotoRace(): void {
        this.router.navigate(['race', Utils.getRandomInt(1, 2)]);
    }
    
    gotoTraining(): void {
        this.router.navigate(['stables']);
    }
    
    gotoExhibition(): void {
       //alert("You participated in a exhibition and earned 50 €.");
       //this.commonService.nextDay();
       this.commonService.exhibition();
    }

    skipDay(): void {
        this.commonService.nextDay();
    }

}

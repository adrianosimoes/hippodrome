import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Player } from '../../model/player';
import { Utils } from '../../model/utils';

import { GameInstance } from '../../model/gameinstance';
import { CommonService } from '../../model/common.service';


@Component( {
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
} )
export class MainComponent implements OnInit {
    currPlayer: Player;
    currGame: GameInstance;
    warningText: string = '';

    constructor( private router: Router, public commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
        this.currPlayer = this.commonService.getPlayer();
        this.currGame = this.commonService.getGameInstance();
    }

    pickRace(): void {
        this.router.navigate( ['pickRace'] );
    }

    gotoTraining(): void {
        this.router.navigate( ['training'] );
    }

    gotoExhibition(): void {
        this.commonService.exhibition();
    }

    skipDay(): void {
        this.commonService.skipDay();
    }

}

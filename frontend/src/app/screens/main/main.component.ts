import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../../model/player';

import { GameInstance } from '../../model/gameinstance';
import { CommonService } from '../../model/services/common.service';
import { League } from 'src/app/model/league';
import { Utils } from 'src/app/model/utils';


@Component( {
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
} )
export class MainComponent implements OnInit {
    currPlayer: Player;
    currGame: GameInstance;
    utils: Utils;
    xpNextLevel: number;
    warningText = '';

    constructor(private router: Router, public commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
            return;
        }

        this.currPlayer = this.commonService.getPlayer();
        this.currGame = this.commonService.getGameInstance();
        this.xpNextLevel = this.commonService.getNextXPLevel( this.currPlayer );
        this.utils = Utils;
        if ( this.currPlayer.xpPoints >= this.commonService.getNextXPLevel( this.currPlayer ) ) {
            this.router.navigate( ['levelUp'] );
        }
    }

    next(): void {
        const currLeague: League = this.commonService.getCurrentLeague();
        const index: number = this.commonService.getThisWeekRaceIndex();
        if ( index >= 0 ) {
            this.router.navigate( ['race', currLeague.races[index].id] );
        } else {
            this.commonService.nextWeek(200);
        }
    }

    gotoTraining(): void {
        this.router.navigate( ['training'] );
    }

    gotoStables(): void {
        this.router.navigate( ['stables'] );
    }

    gotoShop(): void {
        this.router.navigate( ['shop'] );
    }

    gotoExhibition(): void {
        this.commonService.exhibition();
    }

    skipDay(): void {
        this.commonService.nextWeek( 200 );
    }

    gotolevelUp(): void {
        this.router.navigate( ['levelUp'] );
    }

    gotoLeague() {
        this.router.navigate( ['league', 'main'] );
    }

}

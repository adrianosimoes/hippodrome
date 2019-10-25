import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Player } from '../../model/player';
import { Utils } from '../../model/utils';

import { GameInstance } from '../../model/gameinstance';
import { CommonService } from '../../model/services/common.service';


@Component( {
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
} )
export class MainComponent implements OnInit {
    currPlayer: Player;
    currGame: GameInstance;
    xpNextLevel: number;
    warningText: string = '';

    constructor( private router: Router, public commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
            return;
        }

        this.currPlayer = this.commonService.getPlayer();
        this.currGame = this.commonService.getGameInstance();
        this.xpNextLevel = this.commonService.getNextXPLevel( this.currPlayer);
        if(this.currPlayer.xpPoints >= this.commonService.getNextXPLevel(this.currPlayer) ){
            this.router.navigate( ['levelUp'] );
        }
    }

    pickRace(): void {
        this.router.navigate( ['pickRace'] );
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
        this.commonService.skipDay();
    }
    
    gotolevelUp(): void {
        this.router.navigate( ['levelUp'] );
    }

}

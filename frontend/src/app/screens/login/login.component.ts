import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Player } from '../../model/player';
import { CommonService } from '../../model/services/common.service';
import { GameInstance } from '../../model/gameinstance';
import { Utils } from "src/app/model/utils";



@Component( {
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
} )
export class LoginComponent implements OnInit {
    player: Player;
    savedGame: GameInstance;


    constructor( private router: Router, private commonService: CommonService ) { }

    ngOnInit() {
        this.player = this.commonService.getPlayer();
        this.savedGame = this.commonService.savedGame;
    }

    saveForm(): void {
        if(this.player.name==''){
            this.player.name = 'The McCoys';
        }
        this.router.navigate( ['shop'] );
        this.commonService.setInitialized();
    }

    loadGame() : void {
        this.commonService.loadSavedGame();
        Utils.clickyPagView("loadGame?money=" +  this.commonService.gameInstance.playerOne.money 
                + "&prestige=" +  this.commonService.gameInstance.playerOne.prestigePoints
                + "&victories=" +  this.commonService.gameInstance.playerOne.victories 
                + "&races=" +  this.commonService.gameInstance.playerOne.totalRaces
                + "&horses=" +  this.commonService.gameInstance.playerOne.horses.length, "Load Game");
        this.router.navigate( ['main'] );
    }
    
    nextSilkType() : void {
        this.player.nextSlikType();
        this.recalculateColor();
    }
    
    recalculateColor() : void {
        this.player.recalculateBackground();
    }
    
}

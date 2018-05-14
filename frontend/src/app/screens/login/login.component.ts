import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Player } from '../../model/player';
import { CommonService } from '../../model/common.service';
import { GameInstance } from '../../model/gameinstance';



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

    loadGame() {
        this.commonService.gameInstance = this.commonService.savedGame;
        this.router.navigate( ['main'] );
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommonService } from '../../model/services/common.service';
import { Utils } from '../../model/utils';
import { Race } from '../../model/race';
import { Player } from "src/app/model/player";
import { League } from "src/app/model/league";



@Component( {
    selector: 'app-pick-race',
    templateUrl: './pick-race.component.html',
    styleUrls: ['./pick-race.component.css']
} )
export class PickRaceComponent implements OnInit {
    currPlayer: Player;
    leagues: League[];
    debug : boolean = Utils.devMode();

    constructor( private router: Router, public commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
            return;
        }
        this.currPlayer = this.commonService.getPlayer();
        for(let i=0; i < this.commonService.leagues.length;i++){
            if(!this.commonService.leagues[i].isInitialized()){
                this.commonService.leagues[i].restartLeague(this.commonService);
            }
        }
        this.leagues = this.commonService.leagues;
    }

    gotoRace(): void {
        let currLeague: League = this.commonService.getCurrentLeague();
        let index: number = currLeague.getNextRace();
        this.router.navigate( ['race', currLeague.races[index].id] );
    }

}

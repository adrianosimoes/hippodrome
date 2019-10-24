import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommonService } from '../../model/services/common.service';
import { Utils } from '../../model/utils';
import { Race } from '../../model/race';
import { Player } from "src/app/model/player";
import { RaceLeague, RaceLeagueInstance } from "src/app/model/raceleague";



@Component( {
    selector: 'app-pick-race',
    templateUrl: './pick-race.component.html',
    styleUrls: ['./pick-race.component.css']
} )
export class PickRaceComponent implements OnInit {
    currPlayer: Player;
    racesLeagueInstances: RaceLeagueInstance[];
    debug : boolean = Utils.devMode();

    constructor( private router: Router, public commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
        this.currPlayer = this.commonService.getPlayer();
        for(let i=0;i< this.commonService.racesLeagueInstances.length;i++){
            if(!this.commonService.racesLeagueInstances[i].isInitialized()){
                this.commonService.racesLeagueInstances[i].restartLeague(this.commonService);
            }
        }
        this.racesLeagueInstances = this.commonService.racesLeagueInstances;
    }


    gotoRace( currLeague: RaceLeagueInstance ): void {
        let index: number = currLeague.getNextRace();
        this.router.navigate( ['race', currLeague.baseRaceLeague.races[index].id] );
    }

}

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommonService } from '../../model/common.service';
import { Utils } from '../../model/utils';
import { Race, RaceLeague } from '../../model/race';
import { Player } from "src/app/model/player";



@Component( {
    selector: 'app-pick-race',
    templateUrl: './pick-race.component.html',
    styleUrls: ['./pick-race.component.css']
} )
export class PickRaceComponent implements OnInit {
    currPlayer: Player;
    debug : boolean = Utils.devMode();

    constructor( private router: Router, public commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
        this.currPlayer = this.commonService.getPlayer();
    }


    gotoRace( currLeague: RaceLeague ): void {
        let index = Utils.getRandomInt( 0, currLeague.races.length - 1);
        this.router.navigate( ['race', currLeague.races[index].id] );
    }

}

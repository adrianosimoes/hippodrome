import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommonService } from '../../model/common.service';
import { Utils } from '../../model/utils';
import { Race, RaceLeague } from '../../model/race';



@Component( {
    selector: 'app-pick-race',
    templateUrl: './pick-race.component.html',
    styleUrls: ['./pick-race.component.css']
} )
export class PickRaceComponent implements OnInit {

    constructor( private router: Router, public commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
    }


    gotoRace( currLeague: RaceLeague ): void {
        let index = Utils.getRandomInt( 0, currLeague.races.length - 1);
        this.router.navigate( ['race', currLeague.races[index].id] );
    }

}

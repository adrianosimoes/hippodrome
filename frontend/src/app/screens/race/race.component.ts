import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Player } from '../../model/player';
import { Utils } from '../../model/utils';
import { Horse, HorseInRace } from '../../model/horse';
import { Race } from '../../model/race';
import { RaceInstance } from '../../model/raceinstance';
import { CommonService } from '../../model/common.service';

@Component( {
    selector: 'app-race',
    templateUrl: './race.component.html',
    styleUrls: ['./race.component.css']
} )
export class RaceComponent implements OnInit {
    raceId: number;
    currRace: RaceInstance = null;
    maxDistance: number = null;
    debug : boolean = Utils.devMode();

    constructor( private router: Router, private activeRoute: ActivatedRoute, private commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
        if ( this.commonService.getPlayer().horses.length <= 0 ) {
            return;
        }
        this.raceId = this.activeRoute.snapshot.params['id'];
        let race = this.commonService.getRace( this.raceId );
        this.currRace = new RaceInstance( race, this, this.commonService );
    }

    startRace(): void {
        this.currRace.startRace();
    }

    exitRace() {
        this.commonService.nextDay();
        this.router.navigate( ['main'] );
    }

    ngOnDestroy() {
        if ( this.currRace !== null ) {
            this.currRace.cancel();
        }
    }
}

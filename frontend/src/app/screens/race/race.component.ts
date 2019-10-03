import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import {MatRadioModule} from '@angular/material/radio';
import { Player } from '../../model/player';
import { Utils } from '../../model/utils';
import { Horse, HorseInRace, RaceStrategy } from '../../model/horse';
import { Race } from '../../model/race';
import { RaceInstance, RaceState } from '../../model/raceinstance';
import { CommonService } from '../../model/services/common.service';

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
    RaceState : typeof RaceState = RaceState;
    RaceStrategy : typeof RaceStrategy = RaceStrategy;
    curveRaceMinDistance: number = Race.CURVE_RACE_MIN_DISTANCE;
    roundTrackBottomDistance: number = Race.ROUND_TRACK_BOTTOM_DISTANCE;

    constructor( private router: Router, public activeRoute: ActivatedRoute, public commonService: CommonService ) {}

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
        if ( this.commonService.getPlayer().horses.length <= 0 ) {
            return;
        }
        this.raceId = this.activeRoute.snapshot.params['id'];
        let race = this.commonService.getRace( this.raceId );
        this.currRace = new RaceInstance( race, this.commonService );

    }
    
    startRace(): void {
        this.currRace.startRace();
    }
    
    skipRace() {
        this.commonService.nextDay(null);
        this.router.navigate( ['main'] );
    }

    exitRace() {
        this.commonService.setAuctionHorse(this.currRace.getAuctionHorse());
        this.router.navigate( ['auction'] );
    }

    ngOnDestroy() {
        if ( this.currRace !== null ) {
            this.currRace.cancel();
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrackingUtils, Utils } from '../../model/utils';
import { RaceEffort, RaceTactic } from '../../model/horse';
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
    debug: boolean = Utils.devMode();
    RaceState: typeof RaceState = RaceState;
    RaceEffort: typeof RaceEffort = RaceEffort;
    RaceTactic: typeof RaceTactic = RaceTactic;
    curveRaceMinDistance: number = Race.CURVE_RACE_MIN_DISTANCE;
    roundTrackBottomDistance: number = Race.ROUND_TRACK_BOTTOM_DISTANCE;

    constructor( private router: Router, private trackingUtils: TrackingUtils, public activeRoute: ActivatedRoute, public commonService: CommonService ) {}

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
        if ( this.commonService.getPlayer().horses.length <= 0 ) {
            return;
        }
        this.raceId = this.activeRoute.snapshot.params['id'];
        const race = this.commonService.getRace( this.raceId );
        const currLeague = this.commonService.getLeague( this.raceId );
        this.currRace = new RaceInstance( race, this.commonService, this.trackingUtils, currLeague.teamsInLeague, true, false);
    }

    startRace(): void {
        this.currRace.startRace();
    }

    skipRace() {
        this.commonService.simulateRace(this.commonService.getLeague(this.raceId ), this.currRace.baseRace, false);
        this.commonService.updateLeagues();
        this.router.navigate( ['league', 'nextWeek'] );
    }

    exitRace() {
        this.commonService.updateLeagues();
        this.commonService.setAuctionHorse(this.currRace.getAuctionHorse());
        this.router.navigate( ['league', 'auction'] );
    }

    ngOnDestroy() {
        if ( this.currRace !== null ) {
            this.currRace.cancel();
        }
    }
}

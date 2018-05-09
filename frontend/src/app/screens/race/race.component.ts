import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Player } from '../../model/player';
import { Race } from '../../model/race';
import { Horse, HorseInRace, getRandomInt } from '../../model/horse';
import { CommonService } from '../../model/common.service';


declare var $: any;

@Component( {
    selector: 'app-race',
    templateUrl: './race.component.html',
    styleUrls: ['./race.component.css']
} )
export class RaceComponent implements OnInit {
    raceId: number;
    currRace: Race;
    currPlayer: Player;
    horses: HorseInRace[];
    sortedHorses: HorseInRace[];
    playerHorse: HorseInRace;
    raceStart: Date;
    raceTimer: number;
    preRace: boolean = true;
    raceFinished: boolean = false;
    place: number;
    wonPrize: number = 0;
    canceled: boolean = false;

    constructor( private router: Router, private activeRoute: ActivatedRoute, private commonService: CommonService ) { }

    ngOnInit() {
        this.horses = [];
        this.raceId = this.activeRoute.snapshot.params['id'];
        this.currRace = this.commonService.getRace( this.raceId );
        this.currPlayer = this.commonService.getPlayer();
        this.horses[0] = new HorseInRace( this.currPlayer.horses[0], this.currPlayer.color );
        this.playerHorse = this.horses[0];

        for ( let i = 1; i < this.currRace.numHorses; i++ ) {
            this.horses[i] = new HorseInRace( this.commonService.createRandomHorse( i, this.raceId ), this.commonService.createRandomColor() );
        }

        this.commonService.randomizeArray( this.horses );
        this.sortedHorses = this.horses.slice();
    }

    startRace(): void {
        this.preRace = false;
        this.raceTimer = 0;

        this.raceStart = new Date();
        this.commonService.chargeEntranceFee( this.currRace );
        setTimeout(() => { this.updateRace() }, 100 );
    }

    updateRace(): void {
        let allFinished: boolean = true;
        let maxDistance = this.currRace.distance + parseInt( $( '.raceTrack' ).css( 'marginLeft' ), 10 );

        if ( this.canceled ) {
            return;
        }

        for ( let i = 0; i < this.currRace.numHorses; i++ ) {
            if ( parseInt( $( '#horse' + ( i + 1 ) ).css( 'left' ), 10 ) >= maxDistance ) {
                continue;
            } else {
                allFinished = false;
            }
            let step = getRandomInt( 0, this.horses[i].speed / 4 );
            $( '#horse' + ( i + 1 ) ).css( 'left', '+=' + step );

            this.horses[i].distanceDone += step;
            if ( this.horses[i].distanceDone > this.currRace.distance ) {
                this.horses[i].distanceDone = this.currRace.distance;
            }

        }

        this.commonService.stableSort( this.sortedHorses, ( h1, h2 ) => h2.distanceDone - h1.distanceDone );

        this.raceTimer = ( new Date().getTime() - this.raceStart.getTime() ) / 1000;

        if ( allFinished ) {
            this.raceFinished = true;


            this.place = this.getPlace( this.playerHorse, this.sortedHorses );
            if ( this.currRace.prizes.length >= this.place ) {
                this.wonPrize = this.currRace.prizes[this.place - 1];
                this.currPlayer.money += this.wonPrize;
                if ( this.place == 1 ) {
                    this.currPlayer.victories++;
                }
            }
            return;
        }
        setTimeout(() => { this.updateRace() }, 30 );
    }

    exitRace() {
        this.commonService.nextDay();
        this.router.navigate( ['main'] );
    }

    getPlace( horse: HorseInRace, horses: HorseInRace[] ): number {
        for ( let i = 0; i <= this.currRace.numHorses; i++ ) {
            if ( horse === horses[i] ) {
                return i + 1;
            }
        }
        return -1;
    }

    ngOnDestroy() {
        this.canceled = true;
    }
}

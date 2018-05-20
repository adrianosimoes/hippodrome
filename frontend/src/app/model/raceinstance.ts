import { Horse, HorseInRace } from './horse';
import { RaceComponent } from '../screens/race/race.component';

import { Race } from './race';
import { CommonService } from './common.service';
import { Player } from './player';
import { Utils } from './utils';

declare var $: any;

var TICK_MILLISECONDS: number = 15;
var COMMENT_EVERY_TICKS: number = 134;
var FIRST_TICK_COMMENT = 67;


export enum RaceState {
    PreRace = 1,
    Racing = 2,
    WinnerFinished = 3,
    WaitingFinish = 4,
    RaceFinished = 5
}

export class RaceInstance {
    commonService: CommonService;
    baseRace: Race;
    raceView: RaceComponent
    player: Player;
    playerHorse: HorseInRace;
    horses: HorseInRace[];
    sortedHorses: HorseInRace[];
    numberOfHorses: number;
    raceStart: Date;
    raceTimer: number;
    place: number;
    wonPrize: number = 0;
    canceled: boolean = false;
    cssMaxDistance: number;
    worldChampion: boolean = false;
    lastCommentHorses: HorseInRace[];
    ticksSinceLastComment;
    comments: string[];
    state: RaceState;


    constructor( race: Race, raceView: RaceComponent, commonService: CommonService ) {
        this.baseRace = race;
        this.raceView = raceView;
        this.commonService = commonService;
        this.player = this.commonService.getPlayer();
        this.playerHorse = new HorseInRace( this.commonService.getSelectedHorse(), this.player.color, this.player.calculateBackground );
        this.horses = [];
        this.horses.push( this.playerHorse );
        this.lastCommentHorses = [];
        this.ticksSinceLastComment = 0;
        this.comments = [];
        this.state = RaceState.PreRace;

        for ( let i = 1; i < this.baseRace.numHorses; i++ ) {
            let color: string = this.commonService.createRandomColor()
            let horse = new HorseInRace( this.commonService.createRandomHorse( i, this.baseRace.difficulty ), color, color);
            this.addHorse( horse );
        }

        this.numberOfHorses = this.horses.length;
        Utils.randomizeArray( this.horses );
        this.sortedHorses = this.horses.slice();

        for ( let i = 0; i < this.horses.length; i++ ) {
            this.horses[i].track = i + 1;
        }

        this.cssMaxDistance = this.baseRace.distance + 40;
    }

    addHorse( horse: HorseInRace ): void {
        this.horses.push( horse );
    }

    startRace(): void {

        this.state = RaceState.PreRace;
        this.raceTimer = 0;

        /* Order by speed on live tracking: */
        Utils.stableSort( this.sortedHorses, ( h1, h2 ) => h2.speed - h1.speed );

        this.commonService.chargeEntranceFee( this.baseRace );
        this.state = RaceState.Racing;
        this.comments.push( "Read. Set." );
        setTimeout(() => { this.raceStart = new Date(); this.comments[0] += " Go!"; this.updateRace(); }, 500 );
    }

    updateRace(): void {
        let allFinished: boolean = true;

        if ( this.canceled ) {
            return;
        }

        //Update movement:
        for ( let currHorse of this.horses ) {
            if ( currHorse.cssLeft >= this.cssMaxDistance ) {
                continue;
            } else {
                allFinished = false;
            }

            let step: number = this.getMovementStep( currHorse );
            currHorse.cssLeft += step;

            currHorse.distanceDone += step;
            if ( currHorse.distanceDone > this.baseRace.distance ) {
                this.state = RaceState.WinnerFinished;
                currHorse.distanceDone = this.baseRace.distance;
            }

        }

        this.raceTimer = ( new Date().getTime() - this.raceStart.getTime() ) / 1000;

        Utils.stableSort( this.sortedHorses, ( h1, h2 ) => h2.distanceDone - h1.distanceDone );

        this.updateComments();

        if ( allFinished ) {
            this.finishRace();
            return;
        }
        setTimeout(() => { this.updateRace() }, Utils.devMode() ? TICK_MILLISECONDS : TICK_MILLISECONDS );
    }

    updateComments(): void {
        if ( this.state === RaceState.WinnerFinished ) {
            if ( this.lastCommentHorses[0].track != this.sortedHorses[0].track ) {
                this.addCommentIfNotRepeated( "Amazing! " + this.sortedHorses[0].baseHorse.name + " wins the race in the finish line." );
            } else {
                this.addCommentIfNotRepeated( "It's over. " + this.sortedHorses[0].baseHorse.name + " wins the race." );
            }
            this.state = RaceState.WaitingFinish;
            return;
        }

        if ( this.state === RaceState.Racing ) {
            if ( this.ticksSinceLastComment == FIRST_TICK_COMMENT ) {
                if ( this.lastCommentHorses.length == 0 ) {
                    this.comments.push( "In the first yards " + this.sortedHorses[0].baseHorse.name + " is in front." );
                }

                this.lastCommentHorses = [];
                this.lastCommentHorses[0] = this.sortedHorses[0];
            }

            if ( this.ticksSinceLastComment > COMMENT_EVERY_TICKS && this.ticksSinceLastComment % COMMENT_EVERY_TICKS == FIRST_TICK_COMMENT) {
                if ( this.lastCommentHorses[0].track == this.sortedHorses[0].track ) {
                    this.addCommentIfNotRepeated(this.sortedHorses[0].baseHorse.name + " remains in the lead." );
                } else {
                    if ( this.comments.length >= 2 &&
                        this.comments[this.comments.length - 2].indexOf( this.sortedHorses[0].baseHorse.name, 0 ) >= 0 ) {
                        this.comments.push( "Here goes " + this.sortedHorses[0].baseHorse.name + ", he recovers the lead!" );
                    } else {
                        this.comments.push( this.sortedHorses[0].baseHorse.name + " takes the lead." );
                    }
                }

                this.lastCommentHorses = [];
                this.lastCommentHorses[0] = this.sortedHorses[0];
            }

            this.ticksSinceLastComment++;
        }
    }

    addCommentIfNotRepeated( comment: string ) {
        if ( this.comments[this.comments.length - 1] !== comment ) {
            this.comments.push( comment );
        }
    }

    /* With Stamina calculation */
    getMovementStep( horse: HorseInRace ): number {
        let step = Utils.getRandomInt( 0, horse.speed - 1 );
        //If speed is bigger than 80%, reduce stamina:
        let speedReduction = horse.speed >= 20 ? 0.8 : 0.9
        if ( step >= horse.speed * speedReduction ) {
            horse.tempStamina--;
            if ( horse.tempStamina < 0 ) {
                if ( horse.speed > ( this.baseRace.difficulty * 5 ) + 1 ) {
                    horse.speed--;
                }
                horse.tempStamina = horse.fullStamina;
            }
        }
        if ( step > 0 ) {
            step = Math.log( step );
        }
        return step / 2;
    }

    getPlace( horse: HorseInRace, horses: HorseInRace[] ): number {
        for ( let i = 0; i <= this.horses.length; i++ ) {
            if ( horse === horses[i] ) {
                return i + 1;
            }
        }
        return -1;
    }

    finishRace(): void {
        this.player.totalRaces++;
        this.place = this.getPlace( this.playerHorse, this.sortedHorses );
        if ( this.baseRace.prizes.length >= this.place ) {
            this.wonPrize = this.baseRace.prizes[this.place - 1];
            this.player.money += this.wonPrize;
            if ( this.place == 1 ) {
                this.player.victories++;
                if ( this.baseRace.difficulty == 9 ) {
                    this.worldChampion = true;
                }
            }
        }
        this.state = RaceState.RaceFinished;
    }

    cancel(): void {
        this.canceled = true;
    }
}
import { Horse, HorseInRace } from './horse';
import { RaceComponent } from '../screens/race/race.component';

import { Race } from './race';
import { CommonService } from './common.service';
import { Player } from './player';
import { Utils } from './utils';

declare var $: any;


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
    preRace: boolean = true;
    raceFinished: boolean = false;
    place: number;
    wonPrize: number = 0;
    canceled: boolean = false;
    cssMaxDistance: number;

    constructor( race: Race, raceView: RaceComponent, commonService: CommonService ) {
        this.baseRace = race;
        this.raceView = raceView;
        this.commonService = commonService;
        this.player = this.commonService.getPlayer();
        this.playerHorse = new HorseInRace( this.player.horses[0], this.player.color );
        this.horses = [];
        this.horses.push( this.playerHorse );

        for ( let i = 1; i < this.baseRace.numHorses; i++ ) {
            let horse = new HorseInRace( this.commonService.createRandomHorse( i, this.baseRace.difficulty ), this.commonService.createRandomColor() );
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


        this.preRace = false;
        this.raceTimer = 0;

        /* Order by speed on live tracking: */
        Utils.stableSort( this.sortedHorses, ( h1, h2 ) => h2.speed - h1.speed );
        this.raceStart = new Date();
        this.commonService.chargeEntranceFee( this.baseRace );
        setTimeout(() => { this.updateRace() }, 100 );

    }

    updateRace(): void {
        let allFinished: boolean = true;

        if ( this.canceled ) {
            return;
        }

        //Update movement:


        for ( let i = 0; i < this.horses.length; i++ ) {
            if ( this.horses[i].cssLeft >= this.cssMaxDistance ) {
                continue;
            } else {
                allFinished = false;
            }

            let step: number = this.getMovementStep( this.horses[i] );
            this.horses[i].cssLeft += step;

            this.horses[i].distanceDone += step;
            if ( this.horses[i].distanceDone > this.baseRace.distance ) {
                this.horses[i].distanceDone = this.baseRace.distance;
            }

        }

        Utils.stableSort( this.sortedHorses, ( h1, h2 ) => h2.distanceDone - h1.distanceDone );

        this.raceTimer = ( new Date().getTime() - this.raceStart.getTime() ) / 1000;

        if ( allFinished ) {
            this.finishRace();
            return;
        }
        setTimeout(() => { this.updateRace() }, Utils.devMode() ? 1 : 15 );
    }

    /*getMovementStep(horse : HorseInRace) : number {
        return Utils.getRandomInt(0,  horse.speed /4);
    }*/

    /* With Stamina calculation */
    getMovementStep( horse: HorseInRace ): number {
        let step = Utils.getRandomInt( 0, horse.speed - 1 );
        //If speed is bigger than 80%, reduce stamina:
        if ( step >= horse.speed * 0.90 ) {
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
        this.raceFinished = true;

        this.player.totalRaces++;
        this.place = this.getPlace( this.playerHorse, this.sortedHorses );
        if ( this.baseRace.prizes.length >= this.place ) {
            this.wonPrize = this.baseRace.prizes[this.place - 1];
            this.player.money += this.wonPrize;
            if ( this.place == 1 ) {
                this.player.victories++;
            }
        }
    }

    cancel(): void {
        this.canceled = true;
    }
}
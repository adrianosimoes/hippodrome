import { Horse, HorseInRace, RaceStrategy } from './horse';
import { RaceComponent } from '../screens/race/race.component';
import { Race } from './race';
import { CommonService } from './common.service';
import { Player } from './player';
import { Utils } from './utils';

var START_TIMEOUT: number = 500;
var TICK_MILLISECONDS: number = 15;
var COMMENT_EVERY_TICKS: number = 134;
var FIRST_TICK_COMMENT = 67;
var ACCELERATION_UNTIL_TICKS: number = 330;
export var BORDER_HEIGHT: number = 2;


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
    totalTicks;
    comments: Comment[];
    state: RaceState;
    debugMessage: string;
    baseRaceSpeed: number;
    roundTrack: boolean;
    roundTrackCurvePixels: number = 150;
    topDistance: number;
    cssBottom: number;
    startTimeout: number = START_TIMEOUT;
    tickTime: number = TICK_MILLISECONDS;

    constructor( race: Race, commonService: CommonService ) {
        this.baseRace = race;
        this.commonService = commonService;
        this.player = this.commonService.getPlayer();
        this.playerHorse = new HorseInRace( this.commonService.getSelectedHorse(), this.player.color, this.player.calculateBackground );
        this.horses = [];
        this.horses.push( this.playerHorse );
        this.lastCommentHorses = [];
        this.totalTicks = 0;
        this.comments = [];
        this.state = RaceState.PreRace;
        this.debugMessage = "";
        this.baseRaceSpeed = this.baseRace.difficulty * 5;
        this.cssBottom = (( this.baseRace.numHorses - 1 ) * Race.RACETRACK_HEIGHT) + BORDER_HEIGHT * 2;

        this.roundTrack = race.distance > Race.CURVE_RACE_MIN_DISTANCE;
        this.topDistance = race.distance - ( Race.ROUND_TRACK_BOTTOM_DISTANCE - this.roundTrackCurvePixels / 2 ) - this.roundTrackCurvePixels / 2;

        this.playerHorse.staminaDisplay = Utils.calculateStamina( this.playerHorse.speed, this.playerHorse.baseHorse.speed, 100 );

        for ( let i = 1; i < this.baseRace.numHorses; i++ ) {
            let color: string = this.commonService.createRandomColor();
            let horse = new HorseInRace( this.commonService.createRandomHorse( i, this.baseRace.difficulty ), color, color );
            this.addHorse( horse );
        }

        this.numberOfHorses = this.horses.length;
        Utils.randomizeArray( this.horses );
        this.sortedHorses = this.horses.slice();

        for ( let i = 0; i < this.horses.length; i++ ) {
            this.horses[i].setTrack( i + 1 );
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
        this.comments.push( new Comment( "Read. Set.", "#ffffff" ) );
        setTimeout(() => { this.raceStart = new Date(); this.comments[0].message += " Go!"; this.updateRace(); }, this.startTimeout);
    }

    updateRace(): void {
        let allFinished: boolean = true;
        //console.log("update");
        if ( this.canceled ) {
            return;
        }

        //Update movement:
        for ( let currHorse of this.horses ) {
            if ( ( !this.roundTrack && currHorse.cssLeft >= this.cssMaxDistance ) ||
                ( this.roundTrack && currHorse.distanceDone >= this.baseRace.distance ) ) {
                continue;
            } else {
                allFinished = false;
            }

            let step: number = this.getMovementStep( currHorse );
            this.moveHorse( currHorse, step );

            if ( currHorse.distanceDone > this.baseRace.distance ) {
                this.state = RaceState.WinnerFinished;
                currHorse.distanceDone = this.baseRace.distance;
            }

        }

        this.raceTimer = ( new Date().getTime() - this.raceStart.getTime() ) / 1000;

        Utils.stableSort( this.sortedHorses, ( h1, h2 ) => h2.distanceDone - h1.distanceDone );

        this.updateComments();
        this.totalTicks++;

        if ( allFinished ) {
            this.finishRace();
            return;
        }
        setTimeout(() => { this.updateRace() }, Utils.devMode() ? this.tickTime : this.tickTime );
    }

    moveHorse( currHorse: HorseInRace, step: number ): void {
        if ( !this.roundTrack || currHorse.distanceDone <= this.topDistance - ( this.roundTrackCurvePixels / 2 ) ) {
            currHorse.cssLeft += step;
            currHorse.distanceDone += step;
            if ( this.roundTrack && currHorse.cssTop < this.cssBottom - 5 ) {
                if ( currHorse.track <= 3 ) {
                    currHorse.cssTop += step / 2.5;
                } else currHorse.cssTop += step / 3.5;
            } else {
                this.changeRandomLane( currHorse, true );
            }
            currHorse.cssBaseTop = currHorse.cssTop;
        } else if ( currHorse.distanceDone <= this.topDistance - ( this.roundTrackCurvePixels / 2 ) + ( 2 * Race.ROUND_TRACK_HORSE_CURVE ) ) {
            let curveDone: number = currHorse.distanceDone - ( this.topDistance - this.roundTrackCurvePixels / 2 );
            currHorse.cssTop = currHorse.cssBaseTop + BORDER_HEIGHT + Race.ROUND_TRACK_HORSE_CURVE - ( Race.ROUND_TRACK_HORSE_CURVE * Math.cos(( curveDone * Math.PI ) / ( Race.ROUND_TRACK_HORSE_CURVE * 2 ) ) );
            currHorse.cssLeft += step * Math.cos(( curveDone * Math.PI ) / ( ( Race.ROUND_TRACK_HORSE_CURVE - 4 ) * 2 ) );
            currHorse.distanceDone += step / 1.2;
        } else {
            this.changeRandomLane( currHorse, false );
            currHorse.cssLeft -= step;
            currHorse.distanceDone += step;
        }
    }

    changeRandomLane( currHorse: HorseInRace, begin: boolean ): void {
        if ( this.roundTrack && currHorse.sinceLastLaneChange > 100 ) {
            if ( begin ) {
                var rnd: number = Utils.getRandomInt( 0, 20 );
                if ( rnd == 0 && currHorse.cssTop < this.cssBottom ) {
                    currHorse.cssTop += 1;
                    currHorse.sinceLastLaneChange = 0;
                } else if ( rnd == 1 && currHorse.cssTop > this.cssBottom - 6 ) {
                    currHorse.cssTop -= 1;
                    currHorse.sinceLastLaneChange = 0;
                }
            } else {
                let minCssTop : number = this.cssBottom + 68 + BORDER_HEIGHT;
                if ( currHorse.cssTop > minCssTop) {
                    var rnd: number = Utils.getRandomInt( 0, 70 );
                    let avoidedClostestHorse: boolean = this.avoidClosestHorse( currHorse, minCssTop);
                    if ( avoidedClostestHorse ) {
                        //Change lane faster if horse on the way:
                        currHorse.sinceLastLaneChange = 40;
                    } else {
                        if ( rnd == 0 ) {
                            currHorse.cssTop += 2;
                            currHorse.sinceLastLaneChange = 0;
                        } else if ( rnd == 1 && currHorse.cssTop > minCssTop + 2 ) {
                            currHorse.cssTop -= 2;
                            currHorse.sinceLastLaneChange = 0;
                        }
                    }
                }
            }
        } else {
            currHorse.sinceLastLaneChange++;
        }
    }

    avoidClosestHorse( currHorse: HorseInRace, minCssTop : number ): boolean {
        let frontHorse: HorseInRace = null;
        for ( let i of this.sortedHorses ) {
            if ( currHorse == i ) {
                break;
            }
            frontHorse = i;
        }

        if ( frontHorse != null && frontHorse.distanceDone < currHorse.distanceDone + 30 ) {
            if ( Math.abs( frontHorse.cssTop - currHorse.cssTop ) < 12 ) {
                if ( frontHorse.cssTop <= currHorse.cssTop ) {
                    currHorse.cssTop += 2;
                } else if(currHorse.cssTop > minCssTop + 2) {
                    currHorse.cssTop -= 2;
                }
                return true;
            }
        }
        return false;
    }

    updateComments(): void {
        if ( this.state === RaceState.WinnerFinished ) {
            if ( this.lastCommentHorses[0].track != this.sortedHorses[0].track ) {
                this.addCommentIfNotRepeated(
                    new Comment( "Amazing! " + this.sortedHorses[0].baseHorse.name + " wins the race in the finish line.",
                        this.sortedHorses[0].color ) );
            } else {
                this.addCommentIfNotRepeated(
                    new Comment( "It's over. " + this.sortedHorses[0].baseHorse.name + " wins the race.",
                        this.sortedHorses[0].color ) );
            }
            this.state = RaceState.WaitingFinish;
            return;
        }

        if ( this.state === RaceState.Racing ) {
            if ( this.totalTicks == FIRST_TICK_COMMENT ) {
                if ( this.lastCommentHorses.length == 0 ) {
                    this.comments.push(
                        new Comment( "In the first yards " + this.sortedHorses[0].baseHorse.name + " is in front.",
                            this.sortedHorses[0].color ) );
                }

                this.lastCommentHorses = [];
                this.lastCommentHorses[0] = this.sortedHorses[0];
            }

            if ( this.totalTicks > COMMENT_EVERY_TICKS && this.totalTicks % COMMENT_EVERY_TICKS == FIRST_TICK_COMMENT ) {
                if ( this.lastCommentHorses[0].track == this.sortedHorses[0].track ) {
                    this.addCommentIfNotRepeated(
                        new Comment( this.sortedHorses[0].baseHorse.name + " remains in the lead.",
                            this.sortedHorses[0].color ) );
                } else {
                    if ( this.comments.length >= 2 &&
                        this.comments[this.comments.length - 2].message.indexOf( this.sortedHorses[0].baseHorse.name, 0 ) >= 0 ) {
                        this.comments.push(
                            new Comment( "Here goes " + this.sortedHorses[0].baseHorse.name + ", he recovers the lead!",
                                this.sortedHorses[0].color ) );
                    } else {
                        this.comments.push(
                            new Comment( this.sortedHorses[0].baseHorse.name + " takes the lead.",
                                this.sortedHorses[0].color ) );
                    }
                }

                this.lastCommentHorses = [];
                this.lastCommentHorses[0] = this.sortedHorses[0];
            }
        }
    }

    addCommentIfNotRepeated( comment: Comment ) {
        if ( this.comments[this.comments.length - 1].message !== comment.message ) {
            this.comments.push( comment );
        }
    }

    /* With Stamina calculation */
    getMovementStep( horse: HorseInRace ): number {
        let maxSpeed: number = Utils.precisionRound(( horse.speed * horse.baseHorse.form ) / Horse.AVG_FORM, 2 );
        if ( horse == this.playerHorse ) {
            if ( this.playerHorse.strategy == RaceStrategy.HalfWay && this.playerHorse.distanceDone < this.baseRace.distance / 2 ) {
                maxSpeed = horse.speed >= 20 ? 0.8 * maxSpeed : 0.9 * maxSpeed;
                //console.log("max speed:" + maxSpeed);
            } else if ( this.playerHorse.strategy == RaceStrategy.End && this.playerHorse.distanceDone < ( this.baseRace.distance * 2 ) / 3 ) {
                maxSpeed = horse.speed >= 20 ? 0.8 * maxSpeed : 0.9 * maxSpeed;
            }
        }

        if ( this.totalTicks == 50 ) {
            horse.updateAcc();
        }

        if ( this.totalTicks <= ACCELERATION_UNTIL_TICKS ) {
            maxSpeed *= horse.currentAcceleration;
        }

        let step = Utils.getRandomInt( 0, maxSpeed - 1 );

        //If speed is bigger than 80%, reduce stamina. If slow speed(>20, reduce stamina when speed bigger than 90%):
        let speedReduction = horse.speed >= 20 ? 0.8 : 0.9;
        let formSpeed = Utils.precisionRound(( horse.speed * horse.baseHorse.form ) / Horse.AVG_FORM, 2 );
        if (this.totalTicks > ACCELERATION_UNTIL_TICKS - 330 && step >= formSpeed * speedReduction ) {
            horse.currentStamina--;
            if ( horse.currentStamina < 0 ) {
                if ( Math.floor( horse.speed ) > this.baseRaceSpeed ) {
                    horse.speed--;
                    if ( horse == this.playerHorse ) {
                        horse.staminaDisplay = Utils.calculateStamina( horse.speed, horse.baseHorse.speed, 100 );
                    }
                }
                horse.currentStamina = horse.fullStamina;
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
        this.playerHorse.baseHorse.staminaSpeed = this.playerHorse.speed;
        this.playerHorse.baseHorse.calculateStaminaDisplay();
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

export class Comment {
    message: string;
    color: string;

    constructor( message: string, color: string ) {
        this.message = message;
        this.color = color;
    }
}
import { Utils } from './utils';
import { Race } from 'src/app/model/race';
import { GameConstants } from 'src/app/model/services/gameconstants';
import { TeamInLeague } from 'src/app/model/league';

const TRAINING_PRICE = 1.5;
const SPEED_SKILL_PRICE = 7.5;
const ENDURANCE_SKILL_PRICE = 2.2;
const ACCELERATION_SKILL_PRICE = 1.7;
const TOTAL_SKILL_PRICE = 8.2;
const SKILL_TO_PRICE_MULTIPLIER = 100;

export enum HorseSkills {
    SPEED = 1,
    ENDURANCE = 2,
    ACCELERATION = 3,
}

export enum HorseForm {
    BAD = 15,
    AVERAGE = 16,
    GOOD = 17,
}

export class Horse {

    id: number;
    name: string;
    speed: number;
    endurance: number;
    acceleration: number;
    price: number;
    owned: boolean;
    form: number;
    staminaSpeed: number;
    staminaDisplay: number;

    constructor( id: number, name: string, speed: number, endurance: number, acceleration: number, form: number ) {
        this.id = id;
        this.name = name;
        this.speed = speed;
        this.staminaSpeed = speed;
        this.endurance = endurance;
        this.acceleration = acceleration;
        this.calculateStaminaDisplay();
        this.recalculatePrice();
        this.form = form;
        this.owned = false;
    }

    calculateForm(): void {
        this.form = Utils.getRandomInt( HorseForm.BAD, HorseForm.GOOD );
    };

    calculateStaminaDisplay(): void{
        this.staminaDisplay = Utils.calculateDisplayStamina(this.staminaSpeed, this.speed, 65);
    }

    updateDaillyFitness(): void {
        if (this.staminaSpeed < this.speed){
            this.staminaSpeed = Utils.precisionRound(this.staminaSpeed +
                    (this.staminaSpeed * 0.08 * (this.endurance / 20)), 2);
            if (this.staminaSpeed > this.speed){
                this.staminaSpeed = this.speed;
            }
        }
        this.calculateStaminaDisplay();
    }

    recalculatePrice(){
        this.price = Math.round(( ( SPEED_SKILL_PRICE * ( this.speed * ( this.speed / 10 ) ) )
                + ( ENDURANCE_SKILL_PRICE * ( this.endurance * ( this.endurance / 10 ) ) )
                + ( ACCELERATION_SKILL_PRICE * ( this.acceleration * ( this.acceleration / 10 ) ) ) ) /
                TOTAL_SKILL_PRICE ) * SKILL_TO_PRICE_MULTIPLIER;

    }
}

export enum RaceEffort {
    Everything = 0,
    HalfWay = 1,
    End = 2
}

export enum RaceTactic {
    None = 'None',
    Lead = 'Lead Race',
    Pursuit = 'Pursuit the Lead',
    InThePack = 'Stay in the Back'
}

export class HorseInRace {
    baseHorse: Horse;
    team: TeamInLeague;
    track: number;
    speed: number;
    fullStamina: number;
    currentStamina: number;
    currentAcceleration: number;
    color: string;
    cssBackground: string;
    distanceDone: number;
    cssLeft: number;
    cssBaseTop: number;
    cssTop: number;
    sinceLastLaneChange;
    staminaDisplay: number;
    raceEffort: RaceEffort;
    tactic: RaceTactic;

    constructor( horse: Horse, color: string, cssBackground: string, team: TeamInLeague ) {
        this.baseHorse = horse;
        this.team = team;
        this.speed = horse.staminaSpeed;
        this.fullStamina = Math.round(( horse.endurance * 1.7 ) - 11 );
        this.currentStamina = this.fullStamina;

        this.currentAcceleration = Utils.precisionRound(Math.log10(this.baseHorse.acceleration - 5) / 1.8, 2);
        this.color = color;
        this.cssBackground = cssBackground;
        this.distanceDone = 0;
        this.cssLeft = 12;

        this.raceEffort = RaceEffort.Everything;
        this.tactic = RaceTactic.InThePack;
        this.staminaDisplay = 100;
        this.sinceLastLaneChange = 0;
    }

    setTrack(track: number){
        this.track = track;
        this.cssBaseTop = GameConstants.BORDER_HEIGHT + (this.track - 1) * Race.RACETRACK_HEIGHT;
        this.cssTop =  this.cssBaseTop;
    }

    updateAcc(){
        this.currentAcceleration = Utils.precisionRound(Math.log10(this.baseHorse.acceleration - 5) / 1.8, 2);
    }
}


function getSpeedPrice( speed: number ) {
    return Math.round( SPEED_SKILL_PRICE * ( speed * ( speed / 10 ) ) / TOTAL_SKILL_PRICE );
}

function getAccelerationPrice( acceleration: number ) {
    return Math.round( ACCELERATION_SKILL_PRICE * ( acceleration * ( acceleration / 10 ) ) / TOTAL_SKILL_PRICE );
}

function getEndurancePrice( endurance: number ) {
    return Math.round( ENDURANCE_SKILL_PRICE * ( endurance * ( endurance / 10 ) ) / TOTAL_SKILL_PRICE );
}

export class TrainingHorse {
    baseHorse: Horse;
    trainSpeedPrice: number;
    trainEndurancePrice: number;
    trainAccelerationPrice: number;

    constructor( horse: Horse ) {
        this.baseHorse = horse;
        this.trainSpeedPrice = getSpeedPrice( horse.speed ) * SKILL_TO_PRICE_MULTIPLIER * TRAINING_PRICE;
        this.trainEndurancePrice = getEndurancePrice( horse.endurance ) * SKILL_TO_PRICE_MULTIPLIER * TRAINING_PRICE;
        this.trainAccelerationPrice = getAccelerationPrice( horse.acceleration ) * SKILL_TO_PRICE_MULTIPLIER * TRAINING_PRICE;
    }
}

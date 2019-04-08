import { Utils, BORDER_HEIGHT } from './utils';
import { Race } from "src/app/model/race";

const TRAINING_PRICE: number = 1.5;
const SPEED_SKILL_PRICE: number = 7;
const ENDURANCE_SKILL_PRICE: number = 4;
const ACCELERATION_SKILL_PRICE: number = 4;
const TOTAL_SKILL_PRICE: number = 8;
const SKILL_TO_PRICE_MULTIPLIER: number = 100;

export enum HorseSkills {
    SPEED = 1,
    ENDURANCE = 2,
    ACCELERATION = 3,
}

export class Horse {
    static AVG_FORM: number = 11;
    
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
    calculateForm(): void {
        this.form = Utils.getRandomInt( 10, 12 );
    };
    
    calculateStaminaDisplay(): void{
         this.staminaDisplay = Utils.calculateStamina(this.staminaSpeed, this.speed, 65);
    }
    
    updateDaillyFitness(): void {
        if(this.staminaSpeed < this.speed){
            this.staminaSpeed = Utils.precisionRound(this.staminaSpeed + 
                    (this.staminaSpeed * 0.1 * (this.endurance/20)), 2);
            if(this.staminaSpeed > this.speed){
                this.staminaSpeed = this.speed;
            } 
        }
        this.calculateStaminaDisplay();
    }

    constructor( id: number, name: string, speed: number, endurance: number, acceleration: number, form: number ) {
        this.id = id;
        this.name = name;
        this.speed = speed;
        this.staminaSpeed = speed;
        this.endurance = endurance;
        this.acceleration = acceleration;
        this.calculateStaminaDisplay();
        this.price = Math.round(( ( SPEED_SKILL_PRICE * ( speed * ( speed / 10 ) ) )
            + ( ENDURANCE_SKILL_PRICE * ( endurance * ( endurance / 10 ) ) ) ) / TOTAL_SKILL_PRICE ) * SKILL_TO_PRICE_MULTIPLIER;
        this.form = form;
        this.owned = false;
    }
}

export enum RaceStrategy {
    Everything = 0,
    HalfWay = 1,
    End = 2
}

export class HorseInRace {
    baseHorse: Horse;
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
    strategy: RaceStrategy;

    constructor( horse: Horse, color: string, cssBackground: string ) {
        this.baseHorse = horse;
        this.speed = horse.staminaSpeed;
        this.fullStamina = Math.round(( horse.endurance * 1.7 ) - 11 );
        this.currentStamina = this.fullStamina;
       
        this.currentAcceleration = Utils.precisionRound(Math.log10(horse.acceleration)/3, 2);
        this.color = color;
        this.cssBackground = cssBackground;
        this.distanceDone = 0;
        this.cssLeft = 12;
      
        this.strategy = RaceStrategy.Everything;
        this.staminaDisplay = 100;
        this.sinceLastLaneChange = 0;
    }
    
    setTrack(track: number){
        this.track = track;
        this.cssBaseTop = BORDER_HEIGHT + (this.track - 1) * Race.RACETRACK_HEIGHT;
        this.cssTop =  this.cssBaseTop;
    }
    
    updateAcc(){
        this.currentAcceleration = Utils.precisionRound(Math.log10(this.baseHorse.acceleration)/2.5, 2);
    }
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

function getSpeedPrice( speed: number ) {
    return Math.round( SPEED_SKILL_PRICE * ( speed * ( speed / 10 ) ) / TOTAL_SKILL_PRICE );
}

function getAccelerationPrice( acceleration: number ) {
    return Math.round( ACCELERATION_SKILL_PRICE * ( acceleration * ( acceleration / 10 ) ) / TOTAL_SKILL_PRICE ); 
}

function getEndurancePrice( endurance: number ) {
    return Math.round( ENDURANCE_SKILL_PRICE * ( endurance * ( endurance / 10 ) ) / TOTAL_SKILL_PRICE ); 
}
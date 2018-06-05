import { Utils } from './utils';

const TRAINING_PRICE: number = 1.5;
const SPEED_SKILL_PRICE: number = 7;
const STAMINA_SKILL_PRICE: number = 4;
const TOTAL_SKILL_PRICE: number = 8;
const SKILL_TO_PRICE_MULTIPLIER: number = 100;

export class Horse {
    static AVG_FORM: number = 11;
    
    id: number;
    name: string;
    speed: number;
    fitnessSpeed: number;
    stamina: number;
    price: number;
    owned: boolean;
    form: number;
    staminaDisplay: number;
    calculateForm(): void {
        this.form = Utils.getRandomInt( 10, 12 );
    };
    
    calculateStaminaDisplay(): void{
         this.staminaDisplay = Utils.calculateStamina(this.fitnessSpeed, this.speed, 70);
    }
    
    updateDaillyFitness(): void {
        if(this.fitnessSpeed < this.speed){
            console.log("prev fitness:" + this.fitnessSpeed);
            this.fitnessSpeed = Utils.precisionRound(this.fitnessSpeed + 
                    (this.fitnessSpeed * 0.1 * (this.stamina/20)), 2);
            if(this.fitnessSpeed > this.speed){
                this.fitnessSpeed = this.speed;
            } 
            console.log("next fitness:" + this.fitnessSpeed);
        }
        this.calculateStaminaDisplay();
    }

    constructor( id: number, name: string, speed: number, stamina: number, form: number ) {
        this.id = id;
        this.name = name;
        this.speed = speed;
        this.fitnessSpeed = speed;
        this.stamina = stamina;
        this.calculateStaminaDisplay();
        this.price = Math.round(( ( SPEED_SKILL_PRICE * ( speed * ( speed / 10 ) ) )
            + ( STAMINA_SKILL_PRICE * ( stamina * ( stamina / 10 ) ) ) ) / TOTAL_SKILL_PRICE ) * SKILL_TO_PRICE_MULTIPLIER;
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
    tempStamina: number;
    color: string;
    cssBackground: string;
    distanceDone: number;
    cssLeft: number;
    staminaDisplay: number;
    strategy: RaceStrategy;

    constructor( horse: Horse, color: string, cssBackground: string ) {
        this.baseHorse = horse;
        this.speed = horse.fitnessSpeed;
        this.fullStamina = Math.round(( horse.stamina * 1.7 ) - 11 );
        this.tempStamina = this.fullStamina;
        this.color = color;
        this.cssBackground = cssBackground;
        this.distanceDone = 0;
        this.cssLeft = 12;
        this.strategy = RaceStrategy.Everything;
        this.staminaDisplay = 100;
    }
}

export class TrainingHorse {
    baseHorse: Horse;
    trainSpeedPrice: number;
    trainStaminaPrice: number;

    constructor( horse: Horse ) {
        this.baseHorse = horse;
        this.trainSpeedPrice = getSpeedPrice( horse.speed ) * SKILL_TO_PRICE_MULTIPLIER * TRAINING_PRICE;
        this.trainStaminaPrice = getStaminaPrice( horse.stamina ) * SKILL_TO_PRICE_MULTIPLIER * TRAINING_PRICE;
    }
}

function getSpeedPrice( speed: number ) {
    return Math.round( SPEED_SKILL_PRICE * ( speed * ( speed / 10 ) ) / TOTAL_SKILL_PRICE );
}

function getStaminaPrice( stamina: number ) {
    return Math.round( STAMINA_SKILL_PRICE * ( stamina * ( stamina / 10 ) ) / TOTAL_SKILL_PRICE ); 
}
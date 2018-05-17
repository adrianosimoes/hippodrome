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
    stamina: number;
    price: number;
    owned: boolean;
    form: number;
    calculateForm(): void {
        this.form = Utils.getRandomInt( 10, 12 );
    };

    constructor( id: number, name: string, speed: number, stamina: number, form: number ) {
        this.id = id;
        this.name = name;
        this.speed = speed;
        this.stamina = stamina;
        this.price = Math.round(( ( SPEED_SKILL_PRICE * ( speed * ( speed / 10 ) ) )
            + ( STAMINA_SKILL_PRICE * ( stamina * ( stamina / 10 ) ) ) ) / TOTAL_SKILL_PRICE ) * SKILL_TO_PRICE_MULTIPLIER;
        this.form = form;
        this.owned = false;
    }
}

export class HorseInRace {
    baseHorse: Horse;
    track: number;
    speed: number;
    fullStamina: number;
    tempStamina: number;
    color: string;
    distanceDone: number;
    cssLeft: number;

    constructor( horse: Horse, color: string ) {
        this.baseHorse = horse;
        this.speed = Utils.precisionRound((horse.speed * horse.form) / Horse.AVG_FORM , 2);
        this.fullStamina = Math.round(( horse.stamina * 1.7 ) - 8 );
        this.tempStamina = this.fullStamina;
        this.color = color;
        this.distanceDone = 0;
        this.cssLeft = 12;
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
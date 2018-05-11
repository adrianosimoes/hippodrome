import { Utils } from './utils';


export class Horse {
    id: number;
    name: string;
    speed: number;
    stamina: number;
    price: number;
    owned: boolean;
    form: number;
    calculateForm(): void {
        this.form = Utils.getRandomInt(3, 3);
    };

    constructor(id: number, name: string, speed: number, stamina: number, form: number) {
        this.id = id;
        this.name = name;
        this.speed = speed;
        this.stamina = stamina;
        this.price =  Math.round(((7 * (speed * (speed / 10))) + (4 * (stamina * (stamina /10)))) / 8) * 100;
        this.form = form;
        this.owned = false; 
    }
}

export class HorseInRace {
    track: number;
    name: string;
    speed: number;
    displayStamina: number;
    fullStamina: number;
    tempStamina: number;
    form: number;
    color: string;
    distanceDone: number;
    
     constructor(horse: Horse, color: string) {
        this.name = horse.name;
        this.speed = horse.speed;
        this.displayStamina = horse.stamina;
        this.fullStamina =  Math.round((horse.stamina * 1.7) - 8);
        this.tempStamina = this.fullStamina;
        this.color = color;     
        this.distanceDone = 0;    
     }
}
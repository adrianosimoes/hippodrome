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

    constructor(id: number, name: string, speed: number, stamina: number, price: number, form: number) {
        this.id = id;
        this.name = name;
        this.speed = speed;
        this.stamina = stamina;
        this.price = price;
        this.form = form;
        this.owned = false; 
    }
}

export class HorseInRace {
    track: number;
    name: string;
    speed: number;
    stamina: number;
    form: number;
    color: string;
    distanceDone: number;
    
     constructor(horse: Horse, color: string) {
        this.name = horse.name;
        this.speed = horse.speed;
        this.stamina = horse.stamina;
        this.color = color;     
        this.distanceDone = 0;    
     }
}
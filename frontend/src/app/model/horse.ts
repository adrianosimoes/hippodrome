export class Horse {
    id: number;
    name: string;
    speed: number;
    stamina: number;
    price: number;
    owned: boolean;
    form: number;
    calculateForm(): void {
        this.form = getRandomInt(3, 3);
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
    id: number;
    name: string;
    speed: number;
    stamina: number;
    form: number;
    color: string;
    
     constructor(horse: Horse, color: string) {
        this.id = horse.id;
        this.name = horse.name;
        this.speed = horse.speed;
        this.stamina = horse.stamina;
        this.color = color;         
     }
}


export function getRandomInt(initial: number, max: number) {
    return Math.floor((Math.random() * max + initial) + initial);
}
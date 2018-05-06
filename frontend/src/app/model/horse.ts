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


export function getRandomInt(initial: number, max: number) {
    return Math.floor((Math.random() * max + initial - 1) + initial);
}
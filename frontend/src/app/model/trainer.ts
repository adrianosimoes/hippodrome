export class Trainer {

    id: number;
    name: string;
    price: number;
    trainType: number;
    speed: number;
    description: string;

    constructor(id: number, name: string, trainerPrice: number, trainerType: number, trainerSpeed: number, description: string ) {
        this.id = id; 
        this.name = name
        this.price = trainerPrice;
        this.trainType = trainerType;
        this.speed = trainerSpeed;
        this.description = description;
    }	
}
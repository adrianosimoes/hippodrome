import { Horse, HorseSkills } from './horse';


export class Trainer {

    id: number;
    name: string;
    price: number;
    salary: number;
    trainType: HorseSkills;
    speed: number;
    description: string;

    constructor(id: number, name: string, trainerPrice: number, salary:number, trainerType: HorseSkills, trainerSpeed: number, description: string ) {
        this.id = id; 
        this.name = name
        this.price = trainerPrice;
        this.salary = salary;
        this.trainType = trainerType;
        this.speed = trainerSpeed;
        this.description = description;
    }	
}
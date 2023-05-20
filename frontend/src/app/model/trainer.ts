import { Horse, HorseSkills } from './horse';


export class Trainer {

    id: number;
    name: string;
    price: number;
    salary: number;
    trainType: HorseSkills;
    speed: number;
    quality: number;
    upgradePrice: number;
    description: string;
    trainingHorseId: number;

    constructor( id: number, name: string, trainerPrice: number, salary: number, trainerType: HorseSkills, trainerSpeed: number, trainerQuality: number, description: string ) {
        this.id = id;
        this.name = name;
        this.price = trainerPrice;
        this.salary = salary;
        this.trainType = trainerType;
        this.speed = trainerSpeed;
        this.description = description;
        this.quality = trainerQuality;
        this.upgradePrice = this.price * ( this.quality / 2 );
        this.trainingHorseId = -1;
    }

    calculateUpgradePrice() {
        this.upgradePrice = this.price * ( this.quality / 2 );
        this.salary += this.salary;
    }

    setTrainingHorse(horse: Horse){
        this.trainingHorseId = horse.id;
    }
}

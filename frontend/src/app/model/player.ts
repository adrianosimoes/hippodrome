import { Horse } from './horse';

export class Player {
  id: number;
  name: string;
  color: string;
  secColor: string;
  silkType: number; 
  calculateBackground: string;
  horses: Horse[];
  money: number;
  addHorse (horse : Horse) {
    this.money -= horse.price; 
    let newHorse= new Horse();
    newHorse.name = horse.name;
    newHorse.stamina = horse.stamina;
    newHorse.speed = horse.speed;
    newHorse.price = horse.price;
    newHorse.owned = true; 
    this.horses[0] = newHorse;
  };
      
}

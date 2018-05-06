export class Horse {
  id: number;
  name: string;
  speed: number;
  stamina: number;
  price: number;
  owned: boolean;
  form: number;
  calculateForm() {
      this.form = getRandomInt(3, 3);
  }
}


function getRandomInt(initial: number, max: number) {
    return Math.floor((Math.random() * max + initial - 1) + initial);
}
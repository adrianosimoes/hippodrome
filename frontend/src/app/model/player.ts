import { Horse } from './horse';

export class Player {
    id: number;
    name: string;
    color: string;
    secColor: string;
    silkType: number;
    calculateBackground: string;
    horses: Horse[];
    selectedHorseId: number;
    money: number;
    victories: number;
    totalRaces: number;

    constructor( id: number, name: string, color: string, money: number) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.secColor = '#aaaaaa';
        this.silkType = 1;
        this.calculateBackground = '';
        this.horses = [];
        this.money = money;
        this.victories = 0;
        this.totalRaces = 0;
        
    }

}




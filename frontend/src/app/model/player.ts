import { Horse } from './horse';
import { Trainer } from './trainer';
import { Utils } from './utils';




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
    trainers: Trainer[];

    constructor( id: number, name: string, color: string, secColor: string, silkType: number, money: number ) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.secColor = secColor;
        this.silkType = silkType;
        this.horses = [];
        this.money = money;
        this.victories = 0;
        this.totalRaces = 0;
        this.trainers = [];
        this.recalculateBackground();
    }

    recalculateBackground() {
        this.calculateBackground = Utils.getCssBackground( this.color, this.secColor, this.silkType );
    }

    nextSlikType(): void {
        this.silkType = ( this.silkType + 1 ) % Utils.MAX_SILK_ID;
    }

    static fromJson( player: any ): Player {
        let ret = new Player( player.id, player.name, player.color, player.secColor,
            player.silkType ? player.silkType : 2, player.money );
        ret.victories = player.victories;
        ret.selectedHorseId = player.selectedHorseId;
        ret.horses = player.horses;
        ret.trainers = player.trainers;
        ret.totalRaces = player.totalRaces;

        return ret;
    }
}



import { Horse } from './horse';
import { Trainer } from './trainer';
import { Utils } from './utils';
import { GameConstants } from 'src/app/model/services/gameconstants';
import { League, TeamInLeague } from 'src/app/model/league';
import { CommonService } from 'src/app/model/services/common.service';


export class Player {
    id: number;
    name: string;
    color: string;
    secColor: string;
    silkType: number;
    calculateBackground: string;
    horses: Horse[];
    leagueId: number;
    team: TeamInLeague;
    selectedHorseId: number;
    money: number;
    victories: number;
    totalRaces: number;
    xpPoints: number;
    playerLevel: number;
    skillPoints: number;
    trainers: Trainer[];
    lastHorseId: number;

    constructor( id: number, name: string, color: string, secColor: string, silkType: number, money: number) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.secColor = secColor;
        this.silkType = silkType;
        this.horses = [];
        this.money = money;
        this.victories = 0;
        this.totalRaces = 0;
        this.xpPoints = 0;
        this.playerLevel = 0;
        this.skillPoints = 0;
        this.trainers = [];
        this.lastHorseId = 0;
        this.recalculateBackground();
    }

    static fromJson( player: any): Player {
        const ret = new Player( player.id, player.name, player.color, player.secColor,
            player.silkType !== undefined ? player.silkType : 2, player.money);
        ret.victories = player.victories;
        ret.selectedHorseId = player.selectedHorseId;
        ret.horses = player.horses;
        ret.trainers = player.trainers;
        ret.totalRaces = player.totalRaces;
        ret.xpPoints = player.xpPoints;
        ret.playerLevel = player.playerLevel;
        ret.skillPoints = player.skillPoints;
        ret.leagueId = player.leagueId;
        ret.lastHorseId = player.lastHorseId;
        ret.recalculateBackground();

        return ret;
    }

    recalculateBackground() {
        this.calculateBackground = Utils.getCssBackground( this.color, this.secColor, this.silkType );
    }

    nextSlikType(): void {
        this.silkType = ( this.silkType + 1 ) % GameConstants.MAX_SILK_ID;
    }

    getNewHorseId(): number{
        return ++this.lastHorseId;
    }
}



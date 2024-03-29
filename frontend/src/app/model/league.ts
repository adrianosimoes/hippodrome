import { Race } from './race';
import { Horse } from 'src/app/model/horse';
import { CommonService } from 'src/app/model/services/common.service';
import { Utils, StaticData } from 'src/app/model/utils';

export enum LeagueDay {
    END_OF_SEASON_DAY_1 = -1,
    END_OF_SEASON_DAY_2 = -2,
    NO_RACE = -3
}

export class TeamInLeague {
    name: string;
    horse: Horse;
    color: string;
    points: number;
    isPlayer: boolean;

    constructor( horse: Horse, name: string, color: string, isPlayer: boolean ) {
        this.points = 0;
        if ( name != null ) {
            this.name = name;
        } else {
            this.name = horse.name + ' ' + StaticData.teamNames[Utils.getRandomInt( 0, StaticData.teamNames.length - 1 )];
        }
        this.horse = horse;
        this.color = color;
        this.isPlayer = isPlayer;
    }
}

export class League {
    id: number;
    difficulty: number;
    name: string;
    races: Race[];
    teamsInLeague: TeamInLeague[];
    numberOfWins: number;
    numberOfHorses: number;

    constructor( id: number, difficulty: number, name: string, numberOfWins: number, numberOfHorses: number ) {
        this.id = id;
        this.difficulty = difficulty;
        this.name = name;
        this.races = [];
        this.teamsInLeague = [];
        this.numberOfWins = numberOfWins;
        this.numberOfHorses = numberOfHorses;
    }

    addRace( race: Race ): void {
        this.races.push( race );
    }

    isInitialized() {
        return this.teamsInLeague.length > 0;
    }

    restartLeague( commonService: CommonService ) {
        this.teamsInLeague = [];
        const numberOfHorses = this.numberOfHorses - (commonService.getPlayer().leagueId == this.id ? 1 : 0);
        const randomColors: string[] = commonService.getRandomDifferentItems(numberOfHorses, StaticData.colors);
        const randomNames: string[] = commonService.getRandomDifferentItems(numberOfHorses, StaticData.horseNames);

        for ( let i = 0; i < numberOfHorses; i++ ) {
            const horse = commonService.createRandomHorse(randomNames[i], i, this.difficulty, this.numberOfHorses );
            const team: TeamInLeague = new TeamInLeague( horse, null, randomColors[i], false );
            this.teamsInLeague.push( team );
        }
        if ( commonService.getPlayer().leagueId == this.id ) {
            const team: TeamInLeague = new TeamInLeague( null, commonService.getPlayer().name, commonService.getPlayer().color, true );
            this.teamsInLeague.push( team );
            commonService.getPlayer().team = team;
        }
        Utils.randomizeArray(this.teamsInLeague);
    }
}

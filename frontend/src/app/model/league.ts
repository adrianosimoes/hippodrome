import { Race } from './race';
import { Horse } from "src/app/model/horse";
import { CommonService } from "src/app/model/services/common.service";
import { Utils, StaticData } from "src/app/model/utils";

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
            this.name = horse.name + " " + StaticData.teamNames[Utils.getRandomInt( 0, StaticData.teamNames.length - 1 )];
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
    raceNumber: number;
    numberOfHorses: number;
    numberOfWins: number;

    constructor( id: number, difficulty: number, name: string, numberOfWins: number, numberOfHorses: number ) {
        this.id = id;
        this.difficulty = difficulty;
        this.name = name;
        this.races = [];
        this.teamsInLeague = [];
        this.raceNumber = 0;
        this.numberOfHorses = numberOfHorses;
        this.numberOfWins = numberOfWins;
    }

    addRace( race: Race ): void {
        this.races.push( race );
    }

    isInitialized() {
        return this.teamsInLeague.length > 0;
    }

    getNextRace(): number {
        let oldRace = this.raceNumber;
        this.raceNumber = ( this.raceNumber + 1 ) % this.races.length;
        return oldRace;
    }

    restartLeague( commonService: CommonService ) {
        for ( let i = 0; i < this.numberOfHorses - 1; i++ ) {
            let color: string = commonService.createRandomColor();
            let horse = commonService.createRandomHorse( i, this.difficulty, this.numberOfHorses );
            let team: TeamInLeague = new TeamInLeague( horse, null, color, false );
            this.teamsInLeague.push( team );
        }
        if ( commonService.getPlayer().leagueId == this.id ) {
            let team: TeamInLeague = new TeamInLeague( null, commonService.getPlayer().name, commonService.getPlayer().color, true );
            this.teamsInLeague.push( team );
        }
    }
}
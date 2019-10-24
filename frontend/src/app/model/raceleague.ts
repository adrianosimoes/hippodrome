import { Race } from './race';
import { Horse } from "src/app/model/horse";
import { CommonService } from "src/app/model/services/common.service";
import { Utils, StaticData } from "src/app/model/utils";

export class TeamInLeague{
    name: string;
    horse : Horse;
    color: string;
    prestige: number;

    constructor(horse: Horse, color: string){
        this.prestige=0;
        this.name= horse.name + " " + StaticData.teamNames[Utils.getRandomInt(0, StaticData.teamNames.length - 1)] ;
        this.horse = horse;
        this.color = color;
    }
}

export class RaceLeague {
    difficulty: number;
    name: string;
    races: Race[];
    numberOfWins: number;
    numberOfHorses: number;
        
    constructor( difficulty: number, name: string, numberOfWins: number, numberOfHorses: number){
        this.difficulty = difficulty;
        this.name = name;
        this.races = [];
        this.numberOfWins = numberOfWins;
        this.numberOfHorses = numberOfHorses;
    }

    addRace(race: Race) : void {
        this.races.push(race);
    }
}

export class RaceLeagueInstance {
    baseRaceLeague: RaceLeague;
    teamsInLeague : TeamInLeague[];
    raceNumber : number; 

    constructor(raceLeague: RaceLeague){
        this.baseRaceLeague = raceLeague;
        this.teamsInLeague = [];
        this.raceNumber = 0;
    }
    
    isInitialized(){
        return this.teamsInLeague.length > 0;
    }
    
    getNextRace() : number{
        let oldRace = this.raceNumber;
        this.raceNumber = (this.raceNumber + 1) % this.baseRaceLeague.races.length;
        return oldRace;
    }
    
    restartLeague(commonService: CommonService){
        for(let i=0;i< this.baseRaceLeague.numberOfHorses - 1;i++){
                let color: string = commonService.createRandomColor();
                let horse = commonService.createRandomHorse( i, this.baseRaceLeague.difficulty, this.baseRaceLeague.numberOfHorses );
                let team : TeamInLeague = new TeamInLeague(horse, color);
                this.teamsInLeague.push(team);
        }
    }
}
import { Player } from './player';
import { League } from 'src/app/model/league';
import { Horse } from 'src/app/model/horse';
import { Trainer } from 'src/app/model/trainer';

export class GameInstance {
    name: string;
    date: Date;
    weekNumber: number;
    initialized: boolean;
    playerOne: Player;
    leagues: League[];

    init( player: Player, date: Date, initialized: boolean ) {
        this.playerOne = player;
        this.date = date;
        this.weekNumber = 0;
        this.initialized = initialized;
    }

    load( savedGameJson ) {
        this.date = new Date( savedGameJson.date );
        this.weekNumber = savedGameJson.weekNumber;
        this.initialized = savedGameJson.initialized;

        // Load player:
        this.playerOne = Player.fromJson( savedGameJson.playerOne );

        // Load Horses:
        const horsesJson: Horse[] = savedGameJson.playerOne.horses;
        this.playerOne.horses = [];
        for ( let i = 0; i < horsesJson.length; i++ ) {
            const horseInstance: Horse = new Horse( horsesJson[i].id, horsesJson[i].name,
                horsesJson[i].speed, horsesJson[i].endurance, horsesJson[i].acceleration, horsesJson[i].form );
            horseInstance.owned = true;
            if ( horsesJson[i].staminaSpeed > 0 ) {
                horseInstance.staminaSpeed = horsesJson[i].staminaSpeed;
            }
            horseInstance.calculateStaminaDisplay();
            this.playerOne.horses.push( horseInstance );
        }

        // Load Trainers:
        const trainersJson: Trainer[] = savedGameJson.playerOne.trainers;
        this.playerOne.trainers = [];
        for ( let i = 0; i < trainersJson.length; i++ ) {
            const newTrainer = new Trainer( trainersJson[i].id,
                trainersJson[i].name, trainersJson[i].price, trainersJson[i].salary,
                trainersJson[i].trainType, trainersJson[i].speed, trainersJson[i].quality, trainersJson[i].description );
            newTrainer.trainingHorseId = trainersJson[i].trainingHorseId;
            this.playerOne.trainers.push( newTrainer );
        }

        // Load Leagues:
        const leaguesJson = savedGameJson.leagues;
        this.leagues = [];
        for ( let i = 0; i < leaguesJson.length; i++ ) {
            const league = new League( leaguesJson[i].id, leaguesJson[i].difficulty, leaguesJson[i].name,
                leaguesJson[i].numberOfWins, leaguesJson[i].numberOfHorses );
            league.races = leaguesJson[i].races;
            league.teamsInLeague = leaguesJson[i].teamsInLeague;
            this.leagues.push( league );

            if ( league.id == this.playerOne.leagueId ) {
                for ( let j = 0; j < league.teamsInLeague.length; j++ ) {
                    if ( league.teamsInLeague[j].isPlayer ) {
                        this.playerOne.team = league.teamsInLeague[j];
                        break;
                    }
                }
            }
        }
    }
}

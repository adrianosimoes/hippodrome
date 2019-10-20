import { Horse, TrainingHorse, HorseSkills, HorseForm } from '../horse';
import { Race, RaceLeague } from '../race';
import { Trainer } from '../trainer';
import { Utils } from "src/app/model/utils";
import { GameConstants } from "src/app/model/services/gameconstants";


export class InitService {


    static initHorsesInShop( horsesInShop: Horse[] ) {

        //Initialize Horses in Shop:
        let horse = new Horse( 101, 'Bruce Steel', 13, 17, 12, HorseForm.AVERAGE );
        horsesInShop.push( horse );
        
        horse = new Horse( 102, 'Tom Bolt', 13, 13, 17, HorseForm.AVERAGE );
        horsesInShop.push( horse );

        horse = new Horse( 103, 'Sandra Flash', 15, 13, 11, HorseForm.AVERAGE );
        horsesInShop.push( horse );

        horse = new Horse( 104, 'Jack Diamond', 14, 16, 14, HorseForm.AVERAGE );
        horsesInShop.push( horse );

        horse = new Horse( 105, 'Scarlett King', 20, 28, 25, HorseForm.AVERAGE );
        horsesInShop.push( horse );

        horse = new Horse( 106, 'Brad Dynamite', 25, 40, 35, HorseForm.AVERAGE );
        horsesInShop.push( horse );

        horse = new Horse( 107, 'Samuel Titanium', 50, 55, 50, HorseForm.AVERAGE );
        horsesInShop.push( horse );
    }

    static initRaces( racesLeagues: RaceLeague[] ) {
        let raceLeague = new RaceLeague( 2, "Ungraded", 0 );
        racesLeagues.push( raceLeague );

        let id = 1;

        raceLeague.addRace( new Race( id++, 2, 'Colwall Park', 400, '#338833', 100, 6, [1000, 450, 200] ) );
        raceLeague.addRace( new Race( id++, 2, 'Rous Memorial Stakes', 550, '#626f3d', 100, 6, [1000, 450, 200] ) );
        raceLeague.addRace( new Race( id++, 2, 'Haverfordwest', 750, '#dce2a5', 100, 6, [1000, 450, 200] ) );
        raceLeague.addRace( new Race( id++, 2, 'Pembrokeshire', 730, '#d9e37d', 100, 6, [1000, 450, 200] ) );


        raceLeague = new RaceLeague( 3, "Group 3", 5 );
        racesLeagues.push( raceLeague );

        raceLeague.addRace( new Race( id++, 3, 'Aberystwyth', 450, '#1fba1f', 200, 8, [2600, 1200, 550] ) );
        raceLeague.addRace( new Race( id++, 3, 'Hurst Park', 700, '#9ec629', 200, 8, [2600, 1200, 550] ) );
        raceLeague.addRace( new Race( id++, 3, 'Seaton Delaval Stakes', 800, '#d7e091', 200, 8, [2600, 1200, 550] ) );

        raceLeague = new RaceLeague( 5, "Group 2", 10 );
        racesLeagues.push( raceLeague );

        raceLeague.addRace( new Race( id++, 5, 'Green Grass Stakes', 550, '#2b682b', 400, 8, [5200, 2400, 1100] ) );
        raceLeague.addRace( new Race( id++, 5, 'Alexandra Park', 650, '#485130', 400, 8, [5200, 2400, 1100] ) );
        raceLeague.addRace( new Race( id++, 5, 'Brecknock', 850, '#8a8c7c', 400, 8, [5200, 2400, 1100] ) );

        raceLeague = new RaceLeague( 9, "World Cup", 15 );
        racesLeagues.push( raceLeague );

        raceLeague.addRace( new Race( id++, 9, 'Dorchester', 550, '#145114', 1000, 8, [13000, 6000, 2800] ) );
        raceLeague.addRace( new Race( id++, 9, 'Hastings and St. Leonards', 650, '#555650', 1000, 8, [13000, 6000, 2800] ) );
        raceLeague.addRace( new Race( id++, 9, 'Walsall', 950, '#3d5102', 1000, 8, [13000, 6000, 2800] ) );

    }

    static initTrainers(trainersToSell: Trainer[]) {
        trainersToSell.push( new Trainer( 1, "Acceleration Trainer", 2500, 12, HorseSkills.ACCELERATION, 10, 3,
            "Trains the acceleration every day for the active horse. 1 speed up every 12 days." ) );

        trainersToSell.push( new Trainer( 3, "Endurance Trainer", 3000, 15, HorseSkills.ENDURANCE, 10, 3,
            "Trains the endurance every day for the active horse. 1 endurance up every 10 days." ) );
    }
    
    static initXPPerLevel( xpPerLevel: number[] ) {
        if(Utils.devMode()){
            GameConstants.BASE_XP = 20;
        }
            
        var sum = 0;
        for ( var i = 0; i < 200; i++ ) {
            if ( i == 1 )
                sum = GameConstants.BASE_XP;
            else sum += GameConstants.BASE_XP * i * 1.25;
            xpPerLevel[i] = sum;
        }
    }
    
    static initSkillPointsPerLevel(skillPointsPerLevel: number[]){
        for ( var i = 0; i < 200; i++ ) {
            skillPointsPerLevel[i] = Utils.precisionRound(1 + (i/7), 0);
        }
    }
}
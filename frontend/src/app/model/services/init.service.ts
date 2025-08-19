import { Horse, TrainingHorse, HorseSkills, HorseForm } from '../horse';
import { Race } from '../race';
import { Trainer } from '../trainer';
import { Utils } from 'src/app/model/utils';
import { GameConstants } from 'src/app/model/services/gameconstants';
import { League, LeagueDay } from 'src/app/model/league';


export class InitService {


    static initHorsesInShop( horsesInShop: Horse[] ) {

        // Initialize Horses in Shop:
        let horse = new Horse( 101, 'Bruce Steel', 13, 17, 12, HorseForm.AVERAGE );
        horsesInShop.push( horse );

        horse = new Horse( 102, 'Tom Bolt', 13, 13, 17, HorseForm.AVERAGE );
        horsesInShop.push( horse );

        horse = new Horse( 103, 'Sandra Flash', 15, 14, 10, HorseForm.AVERAGE );
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

    static initRaces( leagues: League[] ) {
        let league = new League( 1, 2, 'Division 4', 0, 6 );
        leagues.push( league );

        let id = 1;

        league.addRace( new Race( id++, 2, 'Pembrokeshire', 710, '#d9e37d', 100, 6, [500, 220, 100] ) );
        league.addRace( new Race( id++, 2, 'Colwall Park', 400, '#338833', 100, 6, [500, 220, 100] ) );
        league.addRace( new Race( id++, 2, 'Rous Memorial Stakes', 470, '#626f3d', 100, 6, [500, 220, 100] ) );
        league.addRace( new Race( id++, 2, 'Haverfordwest', 750, '#dce2a5', 100, 6, [500, 220, 100] ) );


        league = new League( 2, 3, 'Division 3', 5, 8 );
        leagues.push( league );

        league.addRace( new Race( id++, 3, 'Aberystwyth', 450, '#1fba1f', 200, 8, [1300, 600, 270] ) );
        league.addRace( new Race( id++, 3, 'Marseille Borely Racecourse', 500, '#2a822a', 200, 8, [1300, 600, 270] ) );
        league.addRace( new Race( id++, 3, 'Hurst Park', 700, '#9ec629', 200, 8, [1300, 600, 270] ) );
        league.addRace( new Race( id++, 3, 'Seaton Delaval Stakes', 800, '#d7e091', 200, 8, [1300, 600, 270] ) );

        league = new League( 3, 5, 'Division 2', 10, 8 );
        leagues.push( league );

        league.addRace( new Race( id++, 5, 'Green Grass Stakes', 550, '#2b682b', 400, 8, [2600, 1200, 555] ) );
        league.addRace( new Race( id++, 5, 'Alexandra Park', 650, '#485130', 400, 8, [2600, 1200, 555] ) );
        league.addRace( new Race( id++, 5, 'Brecknock', 800, '#cca714', 400, 8, [2600, 1200, 555] ) );
        league.addRace( new Race( id++, 5, 'Chantilly Racecourse', 850, '#abd016', 400, 8, [2600, 1200, 555] ) );

        league = new League( 4, 9, 'World Championship', 15, 8 );
        leagues.push( league );

        league.addRace( new Race( id++, 9, 'Hippodrome d\'Auteuil', 550, '#145114', 1000, 8, [6500, 3000, 1400] ) );
        league.addRace( new Race( id++, 9, 'Hippodrome de Bellerive', 650, '#555650', 1000, 8, [6500, 3000, 1400] ) );
        league.addRace( new Race( id++, 9, 'Hippodrome de la Cote d\'Azur', 950, '#3d5102', 900, 8, [6500, 3000, 1400] ) );
        league.addRace( new Race( id++, 9, 'Hippodrome de la Prairie', 950, '#6a8223', 1000, 8, [6500, 3000, 1400] ) );

    }

    static initTrainers( trainersToSell: Trainer[] ) {
        trainersToSell.push( new Trainer( 1, 'Acceleration Trainer', 2500, 12, HorseSkills.ACCELERATION, 10, 3,
            'Trains the acceleration every day for the active horse. 1 speed up every 12 days.' ) );

        trainersToSell.push( new Trainer( 3, 'Endurance Trainer', 3000, 15, HorseSkills.ENDURANCE, 10, 3,
            'Trains the endurance every day for the active horse. 1 endurance up every 10 days.' ) );
    }

    static initXPPerLevel( xpPerLevel: number[] ) {
        let sum = 0;
        for ( let i = 0; i < 200; i++ ) {
            if ( i == 1 ) {
                sum = GameConstants.BASE_XP;
            } else {
                sum += GameConstants.BASE_XP * i * 1.20;
            }
            xpPerLevel[i] = sum;
        }
    }

    static initSkillPointsPerLevel( skillPointsPerLevel: number[] ) {
        for ( let i = 0; i < 200; i++ ) {
            skillPointsPerLevel[i] = Utils.precisionRound( 1 + ( i / 7 ), 0 );
        }
    }
}

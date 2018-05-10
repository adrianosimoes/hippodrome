import { Injectable } from '@angular/core';
import { GameInstance } from './gameinstance';
import { Utils } from './utils';
import { Player } from './player';
import { Horse } from './horse';
import { Race } from './race';

@Injectable( {
    providedIn: 'root'
} )
export class CommonService {

    gameInitialized: boolean = false;
    horsesInShop: Horse[] = [];
    races = new Map<number, Race>();
    gameInstance: GameInstance;
    playerOne: Player;
    nextHorseID: number;
    horseNames: string[] = ['Annabel', 'Swiftbolt', 'Pocaroo', 'Graceland', 'Darkheart', 'Onix', 'Sugarbolt', 'Colby',
        'Shah', 'Sancho', 'Brandy', 'Webster', 'Galadriel', 'Logan', 'Watson', 'Fidget', 'Explorer', 'Wiley', 'Khan',
        'Sid', 'Izzy', 'Ishtar', 'Frendor', 'Mikan', 'Creed', 'Fafnir', 'Andana', 'Hindoo', 'Agile', 'Ferdinand',
        'Donerail', 'Donau', 'Meridian', 'Azra', 'Worth', 'Fonso'];

    colors: string[] = [
        /*Reds and yellows:*/ '#ff0000', '#ff00ff', '#FA8072', '#800000', '#800080', '#ff6600', '#8B0000',
       /* Yellows */ '#f7cda8', '#EDDA74', '#c5c54f', '#FBB117', '#C2B280', '#C58917',
        /*Greens */ '#00ff00', '#aaaa00', '#808000', '#00dddd', '#556B2F', '#6B8E23',
        /* Blues */  '#000080',
        /* Grey and Brown */ '#000000', '#999999', '#966F33', '#6F4E37', '#7F5217']

    constructor() {
        this.initHorsesInShop();
        this.initRaces();

        this.gameInstance = { date: new Date(), initialized: false };

        this.playerOne = new Player();

        this.playerOne.id = 1;
        this.playerOne.name = 'The McCoys';
        this.playerOne.color = '#0077ee';
        this.playerOne.secColor = '#aaaaaa';
        this.playerOne.silkType = 2;
        this.playerOne.calculateBackground = '';
        this.playerOne.horses = [];
        this.playerOne.money = 5000;
        this.playerOne.victories = 0;
    }

    initHorsesInShop(): void {
        //Initialize Horses in Shop:
        let horse = new Horse( 1, 'Mayana Bolt', 11, 20, 4000, 3 );
        this.horsesInShop.push( horse );

        horse = new Horse( 2, 'Elmer Steel', 8, 25, 4000, 3 );
        this.horsesInShop.push( horse );

        horse = new Horse( 3, 'Caspian Grey', 15, 14, 4000, 3 );
        this.horsesInShop.push( horse );

        horse = new Horse( 4, 'Scarlett Diamond', 14, 20, 4500, 3 );
        this.horsesInShop.push( horse );

        horse = new Horse( 4, 'Aeria King', 11, 25, 4500, 3 );
        this.horsesInShop.push( horse );
        this.nextHorseID = 5;
    }

    initRaces(): void {
        let race = new Race( 1, 2, 'Hurst Park Racecourse', 500, '#338833', 10, 6, [32, 15, 7] );
        this.races[race.id] = race;

        race = new Race( 2, 3, 'Shirley Racecourse', 700, '#626f3d', 20, 6, [64, 30, 14] );
        this.races[race.id] = race;
    };

    getHorsesInShop(): Horse[] {
        return this.horsesInShop;
    }

    getPlayer(): Player {
        return this.playerOne;
    }

    getGameInstance(): GameInstance {
        return this.gameInstance;
    }

    nextDay(): void {
        this.gameInstance.date.setDate( this.gameInstance.date.getDate() + 1 );
        ///Only copied date is updated in the interface.
        this.gameInstance.date = new Date( this.gameInstance.date );
        for ( let currHorse in this.playerOne.horses ) {
            this.playerOne.horses[0].calculateForm();
        }
    }

    addHorseToPlayer( horse: Horse ): boolean {
        if ( this.playerOne.money >= horse.price ) {
            this.playerOne.money -= horse.price;
            let newHorse = new Horse( this.nextHorseID++, horse.name, horse.speed, horse.stamina, horse.price, horse.form );
            newHorse.owned = true;
            newHorse.calculateForm();
            this.playerOne.horses.push( newHorse );
            return true;
        }
        return false;
    }
    
    getRaces(): IterableIterator<Race> {
        return this.races.values();
    }

    getRace( raceId: number ): Race {
        return this.races[raceId];
    }

    createRandomColor(): string {
        return this.colors[Utils.getRandomInt( 0, this.colors.length )];
    }

    createRandomHorse( num: number, difficulty: number ): Horse {
        let name: string = this.horseNames[Utils.getRandomInt( 0, this.horseNames.length )];
        return new Horse( 1000 + num, name, (difficulty * 5) + 1 + Utils.getRandomInt( 0, 7 ), (difficulty * 5) + 1  + Utils.getRandomInt( 0, 7 ), 0, 4 );
    }

    chargeEntranceFee( race: Race ) {
        this.playerOne.money -= race.entranceFee;
    }
    
    setInitialized() {
        this.gameInstance.initialized =  true;
    }

 
}



import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { GameInstance } from './gameinstance';
import { Utils } from './utils';
import { Player } from './player';
import { Horse, TrainingHorse } from './horse';
import { Race } from './race';

declare var Cookies: any;
declare var JSON: any;

@Injectable( {
    providedIn: 'root'
} )
export class CommonService {

    horsesInShop: Horse[] = [];
    races = new Map<number, Race>();
    gameInstance: GameInstance;
    savedGame: GameInstance;
    nextHorseID: number;
    horseNames: string[] = ['Annabel', 'Swiftbolt', 'Pocaroo', 'Graceland', 'Darkheart', 'Onix', 'Sugarbolt', 'Colby',
        'Shah', 'Sancho', 'Brandy', 'Webster', 'Galadriel', 'Logan', 'Watson', 'Fidget', 'Explorer', 'Wiley', 'Khan',
        'Sid', 'Izzy', 'Ishtar', 'Frendor', 'Mikan', 'Creed', 'Fafnir', 'Andana', 'Hindoo', 'Agile', 'Ferdinand',
        'Donerail', 'Donau', 'Meridian', 'Azra', 'Worth', 'Fonso', 'Giacomo'];

    colors: string[] = [
        /*Reds and yellows:*/ '#ff0000', '#ff00ff', '#FA8072', '#800000', '#800080', '#ff6600', '#8B0000',
       /* Yellows */ '#f7cda8', '#EDDA74', '#c5c54f', '#FBB117', '#C2B280', '#C58917',
        /*Greens */ '#00ff00', '#aaaa00', '#808000', '#00dddd', '#556B2F', '#6B8E23',
        /* Blues */  '#000080',
        /* Grey and Brown */ '#000000', '#999999', '#966F33', '#6F4E37', '#7F5217'];

    static TRAIN_SPEED: number = 1;
    static TRAIN_STAMINA: number = 2;

    public loading: boolean;
    public loadingText: string;

    constructor( private router: Router ) {
        this.initHorsesInShop();
        this.initRaces();
        this.loading = false;

        let savedGameString: string = Cookies.get( 'gamev1' );
        if ( savedGameString ) {
            this.loadToSavedSlot( savedGameString );
        }

        let playerOne = new Player( 1, 'The McCoys', '#0077ee', 5000 );
        this.gameInstance = new GameInstance( playerOne, new Date(), false );

    }

    loadToSavedSlot( savedGameString: string ): void {
        this.savedGame = JSON.parse( savedGameString );
        this.savedGame.date = new Date( this.savedGame.date );

        //Load Horses:
        let horsesJson: Horse[] = this.savedGame.playerOne.horses;
        this.savedGame.playerOne.horses = [];

        for ( let i = 0; i < horsesJson.length; i++ ) {
            let horseInstance: Horse = new Horse( horsesJson[i].id, horsesJson[i].name,
                horsesJson[i].speed, horsesJson[i].stamina, horsesJson[i].form );
            horseInstance.owned = true;
            this.savedGame.playerOne.horses.push( horseInstance );
        }
    }

    initHorsesInShop(): void {
        //Initialize Horses in Shop:
        let horse = new Horse( 1, 'Tom Bolt', 12, 16, 3 );
        this.horsesInShop.push( horse );

        horse = new Horse( 2, 'Bruce Steel', 11, 17, 3 );
        this.horsesInShop.push( horse );

        horse = new Horse( 3, 'Sandra Flash', 15, 13, 3 );
        this.horsesInShop.push( horse );

        horse = new Horse( 4, 'Jack Diamond', 14, 18, 3 );
        this.horsesInShop.push( horse );

        horse = new Horse( 4, 'Scarlett King', 18, 26, 3 );
        this.horsesInShop.push( horse );

        horse = new Horse( 5, 'Brad Dynamite', 25, 40, 3 );
        this.horsesInShop.push( horse );

        horse = new Horse( 5, 'Samuel Titanium', 50, 55, 3 );
        this.horsesInShop.push( horse );

        this.nextHorseID = 5;
    }

    initRaces(): void {
        let race = new Race( 1, 2, 'Hurst Park Racecourse', 500, '#338833', 100, 6, [1000, 450, 200] );
        this.races[race.id] = race;

        race = new Race( 2, 2, 'Shirley Racecourse', 600, '#626f3d', 100, 6, [1000, 450, 200] );
        this.races[race.id] = race;

        race = new Race( 3, 3, 'Level 2 Racecourse', 700, '#626f3d', 200, 6, [2000, 900, 400] );
        this.races[race.id] = race;
    };

    getHorsesInShop(): Horse[] {
        return this.horsesInShop;
    }

    getPlayer(): Player {
        return this.gameInstance.playerOne;
    }

    getGameInstance(): GameInstance {
        return this.gameInstance;
    }

    exhibition(): void {
        this.loading = true;
        this.gameInstance.playerOne.money += 50;
        this.nextDay();
        this.loadingText = "You participated in a exhibition and earned 50 €. \n Waiting 7 seconds."
        setTimeout(() => { this.loading = false; this.loadingText = ""; }, 7000 );
    }

    nextDay(): void {
        if ( !this.loading ) {
            this.loading = true;
            setTimeout(() => { this.loading = false; }, 200 );
        }
        this.gameInstance.date.setDate( this.gameInstance.date.getDate() + 1 );
        ///Only copied date is updated in the interface.
        this.gameInstance.date = new Date( this.gameInstance.date );
        for ( let currHorse in this.gameInstance.playerOne.horses ) {
            this.gameInstance.playerOne.horses[0].calculateForm();
        }
        this.saveGame();
    }

    saveGame(): void {
        Cookies.set( 'gamev1', this.gameInstance, { expires: 7 } );
    }

    addHorseToPlayer( horse: Horse ): boolean {
        if ( this.gameInstance.playerOne.money >= horse.price ) {
            this.gameInstance.playerOne.money -= horse.price;
            let newHorse = new Horse( this.nextHorseID++, horse.name, horse.speed, horse.stamina, horse.form );
            newHorse.owned = true;
            newHorse.calculateForm();
            this.gameInstance.playerOne.horses.push( newHorse );
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
        return this.colors[Utils.getRandomInt( 0, this.colors.length - 1 )];
    }

    createRandomHorse( num: number, difficulty: number ): Horse {
        let name: string = this.horseNames[Utils.getRandomInt( 0, this.horseNames.length - 1 )];
        return new Horse( 1000 + num, name, ( difficulty * 5 ) + 1 + Utils.getRandomInt( 0, 6 ), ( difficulty * 5 ) + 2 + Utils.getRandomInt( 0, 6 ), Horse.AVG_FORM );
    }

    chargeEntranceFee( race: Race ) {
        this.gameInstance.playerOne.money -= race.entranceFee;
    }

    setInitialized() {
        this.gameInstance.initialized = true;
    }

    trainHorse( player: Player, horse: TrainingHorse, trainType: number ): boolean {
        let price: number = trainType == CommonService.TRAIN_SPEED ? horse.trainSpeedPrice : horse.trainStaminaPrice;
        if ( player.money >= price ) {
            player.money -= price;
            trainType == CommonService.TRAIN_SPEED ? horse.baseHorse.speed++ : horse.baseHorse.stamina++;
            return true;
        } else {
            return false;
        }
    }

    isInitialized(): boolean {
        return this.gameInstance.initialized;
    }

}



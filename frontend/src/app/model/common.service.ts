import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { GameInstance } from './gameinstance';
import { Utils, StaticData } from './utils';
import { Player } from './player';
import { Horse, TrainingHorse } from './horse';
import { Race } from './race';
import { Trainer } from './trainer';


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

    static TRAIN_SPEED: number = 1;
    static TRAIN_STAMINA: number = 2;

    public loading: boolean;
    public loadingText: string;

    constructor( private router: Router ) {
        this.initHorsesInShop();
        this.initRaces();
        this.loading = false;

        let savedGameString: string = Cookies.get( StaticData.saveGameName );
        if ( savedGameString ) {
            this.loadToSavedSlot( savedGameString );
        }

        let playerOne = new Player( 1, '', '#0077ee', Utils.devMode() ? 20000 : 5000 );
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
        let horse = new Horse( 101, 'Tom Bolt', 12, 16, Horse.AVG_FORM );
        this.horsesInShop.push( horse );

        horse = new Horse( 102, 'Bruce Steel', 11, 17, Horse.AVG_FORM );
        this.horsesInShop.push( horse );

        horse = new Horse( 103, 'Sandra Flash', 15, 13, Horse.AVG_FORM );
        this.horsesInShop.push( horse );

        horse = new Horse( 104, 'Jack Diamond', 14, 18, Horse.AVG_FORM );
        this.horsesInShop.push( horse );

        horse = new Horse( 105, 'Scarlett King', 18, 26, Horse.AVG_FORM );
        this.horsesInShop.push( horse );

        horse = new Horse( 106, 'Brad Dynamite', 25, 40, Horse.AVG_FORM );
        this.horsesInShop.push( horse );

        horse = new Horse( 107, 'Samuel Titanium', 50, 55, Horse.AVG_FORM );
        this.horsesInShop.push( horse );
    }

    initRaces(): void {
        let race = new Race( 1, 2, 'Anglesey', 450, '#338833', 100, 6, [1000, 450, 200] );
        this.races[race.id] = race;

        race = new Race( 2, 2, 'Hurst Park', 600, '#626f3d', 100, 6, [1000, 450, 200] );
        this.races[race.id] = race;

        race = new Race( 3, 2, 'Alexandra Park', 750, '#eef4be', 100, 6, [1000, 450, 200] );
        this.races[race.id] = race;

        race = new Race( 4, 3, 'Wrexham', 700, '#626f3d', 200, 6, [2000, 900, 400] );
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
        this.loadingText = "You participated in a exhibition and earned 50 €. \n Waiting 5 seconds."
        setTimeout(() => { this.loading = false; this.loadingText = ""; }, 5000 );
    }

    nextDay(): void {
        if ( !this.loading ) {
            this.loading = true;
            setTimeout(() => { this.loading = false; }, 200 );
        }
        this.gameInstance.date.setDate( this.gameInstance.date.getDate() + 1 );
        ///Only copied date is updated in the interface.
        this.gameInstance.date = new Date( this.gameInstance.date );
        for ( let currHorse of this.gameInstance.playerOne.horses ) {
            currHorse.calculateForm();
        }
        this.applyTrainers();
        this.saveGame();
    }

    applyTrainers(): void {
        let selectedHorse: Horse = this.getSelectedHorse();
        for ( let currTrainer of this.gameInstance.playerOne.trainers ) {
            let trainStep = 1 / currTrainer.speed;
            if ( currTrainer.trainType == CommonService.TRAIN_SPEED ) {
                selectedHorse.speed += trainStep;
            } else {
                selectedHorse.stamina += trainStep;
            }
        }
    }

    saveGame(): void {
        Cookies.set( StaticData.saveGameName, this.gameInstance, { expires: 7 } );
    }

    addHorseToPlayer( horse: Horse ): boolean {
        if ( this.gameInstance.playerOne.money >= horse.price ) {
            this.gameInstance.playerOne.money -= horse.price;
            let newHorse = new Horse( this.gameInstance.playerOne.horses.length + 1, horse.name, horse.speed, horse.stamina, horse.form );
            newHorse.owned = true;
            newHorse.calculateForm();
            this.gameInstance.playerOne.horses.push( newHorse );
            if ( this.gameInstance.playerOne.horses.length == 1 ) {
                this.gameInstance.playerOne.selectedHorseId = newHorse.id;
            }
            return true;
        }
        return false;
    }

    selectHorse( horse: Horse ): void {
        this.gameInstance.playerOne.selectedHorseId = horse.id;
    }

    getSelectedHorse(): Horse {
        for ( let currHorse of this.gameInstance.playerOne.horses ) {
            if ( currHorse.id === this.gameInstance.playerOne.selectedHorseId ) {
                return currHorse;
            }
        }

        return null;
    }

    getRaces(): IterableIterator<Race> {
        return this.races.values();
    }

    getRace( raceId: number ): Race {
        return this.races[raceId];
    }

    createRandomColor(): string {
        return StaticData.colors[Utils.getRandomInt( 0, StaticData.colors.length - 1 )];
    }

    createRandomHorse( num: number, difficulty: number ): Horse {
        let name: string = StaticData.horseNames[Utils.getRandomInt( 0, StaticData.horseNames.length - 1 )];
        return new Horse( 1000 + num, name, ( difficulty * 5 ) + 1 + Utils.getRandomInt( 0, 6 ), ( difficulty * 5 ) + 2 + Utils.getRandomInt( 0, 6 ), Horse.AVG_FORM );
    }

    chargeEntranceFee( race: Race ) {
        this.gameInstance.playerOne.money -= race.entranceFee;
    }

    setInitialized() {
        this.gameInstance.initialized = true;
    }

    buyHorseSkill( player: Player, horse: TrainingHorse, trainType: number ): boolean {
        let price: number = trainType == CommonService.TRAIN_SPEED ? horse.trainSpeedPrice : horse.trainStaminaPrice;
        if ( player.money >= price ) {
            player.money -= price;
            trainType == CommonService.TRAIN_SPEED ? horse.baseHorse.speed++ : horse.baseHorse.stamina++;
            return true;
        } else {
            return false;
        }
    }

    buyTrainer( player: Player, trainer: Trainer ) {
        if ( player.money >= trainer.price ) {
            player.money -= trainer.price;
            this.gameInstance.playerOne.trainers.push( trainer );
            return true;
        } else {
            return false;
        }
    }

    isInitialized(): boolean {
        return this.gameInstance.initialized;
    }

}



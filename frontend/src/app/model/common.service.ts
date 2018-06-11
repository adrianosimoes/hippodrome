import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { GameInstance } from './gameinstance';
import { Utils, StaticData } from './utils';
import { Player } from './player';
import { Horse, TrainingHorse } from './horse';
import { Race, RaceLeague } from './race';
import { Trainer } from './trainer';


declare var Cookies: any;
declare var JSON: any;

@Injectable( {
    providedIn: 'root'
} )
export class CommonService {

    horsesInShop: Horse[] = [];
    racesLeagues: RaceLeague[];
    gameInstance: GameInstance;
    savedGame: GameInstance;
    backgroundImage: SafeStyle;

    static TRAIN_SPEED: number = 1;
    static TRAIN_STAMINA: number = 2;

    public loading: boolean;
    public loadingText: string;

    constructor( private router: Router, private _sanitizer: DomSanitizer ) {
        this.initHorsesInShop();
        this.initRaces();
        this.loading = false;


        let savedGameString: string = Cookies.get( StaticData.saveGameName );
        if ( savedGameString ) {
            this.loadToSavedSlot( savedGameString );
        }

        let playerOne = new Player( 1, '', '#1281f1', '#feda10', 0, Utils.devMode() ? 105000 : 5000 );
        this.gameInstance = new GameInstance( playerOne, new Date(), false );
        this.generateBgImage();
    }

    loadToSavedSlot( savedGameString: string ): void {
        this.savedGame = JSON.parse( savedGameString );
        this.savedGame.date = new Date( this.savedGame.date );

        //Load player:
        this.savedGame.playerOne = Player.fromJson( this.savedGame.playerOne );

        //Load Horses:
        let horsesJson: Horse[] = this.savedGame.playerOne.horses;
        this.savedGame.playerOne.horses = [];
        for ( let i = 0; i < horsesJson.length; i++ ) {
            let horseInstance: Horse = new Horse( horsesJson[i].id, horsesJson[i].name,
                horsesJson[i].speed, horsesJson[i].stamina, horsesJson[i].form );
            horseInstance.owned = true;
            if ( horsesJson[i].fitnessSpeed > 0 ) {
                horseInstance.fitnessSpeed = horsesJson[i].fitnessSpeed;
            }
            horseInstance.calculateStaminaDisplay();
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
        this.racesLeagues = [];

        let raceLeague = new RaceLeague( 2, "Ungraded" );
        this.racesLeagues.push( raceLeague );

        raceLeague.addRace( new Race( 1, 2, 'Colwall Park', 400, '#338833', 100, 6, [1000, 450, 200] ) );
        raceLeague.addRace( new Race( 2, 2, 'Rous Memorial Stakes', 550, '#626f3d', 100, 6, [1000, 450, 200] ) );
        raceLeague.addRace( new Race( 3, 2, 'Haverfordwest', 650, '#eef4be', 100, 6, [1000, 450, 200] ) );

        raceLeague = new RaceLeague( 3, "Group 3" );
        this.racesLeagues.push( raceLeague );

        raceLeague.addRace( new Race( 4, 3, 'Aberystwyth', 450, '#1fba1f', 200, 8, [2600, 1200, 550] ) );
        raceLeague.addRace( new Race( 5, 3, 'Hurst Park', 700, '#9ec629', 200, 8, [2600, 1200, 550] ) );
        raceLeague.addRace( new Race( 6, 3, 'Seaton Delaval Stakes', 800, '#d7e091', 200, 8, [2600, 1200, 550] ) );

        raceLeague = new RaceLeague( 5, "Group 2" );
        this.racesLeagues.push( raceLeague );

        raceLeague.addRace( new Race( 7, 5, 'Green Grass Stakes', 550, '#2b682b', 400, 8, [5200, 2400, 1100] ) );
        raceLeague.addRace( new Race( 8, 5, 'Alexandra Park', 650, '#485130', 400, 8, [5200, 2400, 1100] ) );
        raceLeague.addRace( new Race( 9, 5, 'Brecknock', 850, '#8a8c7c', 400, 8, [5200, 2400, 1100] ) );

        raceLeague = new RaceLeague( 9, "World Cup" );
        this.racesLeagues.push( raceLeague );

        raceLeague.addRace( new Race( 10, 9, 'Dorchester', 550, '#145114', 1000, 8, [13000, 6000, 2800] ) );
        raceLeague.addRace( new Race( 11, 9, 'Hastings and St. Leonards', 650, '#555650', 1000, 8, [13000, 6000, 2800] ) );
        raceLeague.addRace( new Race( 12, 9, 'Walsall', 950, '#3d5102', 1000, 8, [13000, 6000, 2800] ) );

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
        this.gameInstance.playerOne.money += 100;
        this.nextDay();
        this.loadingText = "You participated in a exhibition and earned 100 €. \n Waiting 5 seconds."
        setTimeout(() => { this.loading = false; this.loadingText = ""; }, 5000 );
    }

    nextDay(): void {
        this.gameInstance.date.setDate( this.gameInstance.date.getDate() + 1 );
        this.generateBgImage();
        if ( !this.loading ) {
            this.loading = true;
            setTimeout(() => { this.loading = false; }, 200 );
        }
        ///Only copied date is updated in the interface.
        this.gameInstance.date = new Date( this.gameInstance.date );
        this.applyTrainers( this.gameInstance.playerOne );
        for ( let currHorse of this.gameInstance.playerOne.horses ) {
            currHorse.calculateForm();
            currHorse.updateDaillyFitness();
        }
        this.saveGame();
    }

    applyTrainers( player: Player ): void {
        let selectedHorse: Horse = this.getSelectedHorse();
        for ( let currTrainer of this.gameInstance.playerOne.trainers ) {
            //Pay salary:
            player.money -= currTrainer.salary;
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

    getRace( raceId: number ): Race {
        for ( let raceLeague of this.racesLeagues ) {
            for ( let race of raceLeague.races ) {
                if ( race.id == raceId ) {
                    return race;
                }
            }
        }
        return null;
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

    sellTrainer( player: Player, trainer: Trainer ) {
        var index = player.trainers.indexOf( trainer, 0 );
        if ( index > -1 ) {
            player.trainers.splice( index, 1 )
            player.money += trainer.price / 2;
        }
    }

    isInitialized(): boolean {
        return this.gameInstance.initialized;
    }

    generateBgImage() {
        if ( !Utils.devMode() ) {
            this.backgroundImage = 'url("assets/bg' + ( ( this.gameInstance.date.getDate() % 11 ) + 1 ) + '.jpg")';
        } else {
            this.backgroundImage = 'url("assets/bg7.jpg")';
        }
    }

}



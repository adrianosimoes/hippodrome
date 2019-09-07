import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { InitService } from './init.service';
import { GameInstance } from '../gameinstance';
import { Utils, StaticData } from '../utils';
import { Player } from '../player';
import { Horse, TrainingHorse, HorseSkills } from '../horse';
import { Race, RaceLeague } from '../race';
import { Trainer } from '../trainer';


declare var Cookies: any;
declare var JSON: any;

@Injectable( {
    providedIn: 'root'
} )
export class CommonService {

    horsesInShop: Horse[];
    racesLeagues: RaceLeague[];
    trainersToSell: Trainer[];
    gameInstance: GameInstance;
    savedGame: GameInstance;
    backgroundImage: SafeStyle;
    loadingBackground: SafeStyle;

    public loading: boolean;
    public loadingText: string;

    constructor( private router: Router) {
        this.initHorsesInShop();
        this.initRaces();
        this.initTrainers();
        this.loading = false;

        let savedGameString: string = Cookies.get( StaticData.saveGameName );
        if ( savedGameString ) {
            this.loadToSavedSlot( savedGameString );
        }

        let playerOne = new Player( 1, '', '#1281f1', '#feda10',
            0, Utils.devMode() ? 105000 : InitService.INITIAL_MONEY );
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
                horsesJson[i].speed, horsesJson[i].endurance, horsesJson[i].acceleration, horsesJson[i].form );
            horseInstance.owned = true;
            if ( horsesJson[i].staminaSpeed > 0 ) {
                horseInstance.staminaSpeed = horsesJson[i].staminaSpeed;
            }
            horseInstance.calculateStaminaDisplay();
            this.savedGame.playerOne.horses.push( horseInstance );
        }
        //Load Trainers:
        let trainersJson: Trainer[] = this.savedGame.playerOne.trainers;
        this.savedGame.playerOne.trainers = [];
        for ( let i = 0; i < trainersJson.length; i++ ) {
            let newTrainer = new Trainer(trainersJson[i].id,
                    trainersJson[i].name, trainersJson[i].price, trainersJson[i].salary,
                    trainersJson[i].trainType, trainersJson[i].speed, trainersJson[i].quality, trainersJson[i].description);
            this.savedGame.playerOne.trainers.push(newTrainer);
        }
        
    }

    loadSavedGame(): void {
        this.gameInstance = this.savedGame;
        this.loadBgImage( this.savedGame.date );
    }

    initHorsesInShop(): void {
        this.horsesInShop = [];
        InitService.initHorsesInShop(this.horsesInShop);
      
    }

    initRaces(): void {
        this.racesLeagues = [];
        InitService.initRaces(this.racesLeagues);
    };

    initTrainers(): void {
        this.trainersToSell = [];
        InitService.initTrainers(this.trainersToSell);
    }

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
        Utils.clickyPagView("money:" +  this.gameInstance.playerOne.money, "Exhibition");
        this.gameInstance.playerOne.money += 100;
        this.nextDay( null );
        this.loadingText = "You participated in a exhibition and earned 100 €. \n Waiting 5 seconds."
        setTimeout(() => { this.loading = false; this.loadingText = ""; }, 5000 );
    }

    skipDay(): void {
        this.nextDay( 400 );
    }

    nextDay( delay: number ): void {
        this.gameInstance.date.setDate( this.gameInstance.date.getDate() + 1 );
        this.generateBgImage();
        if ( !this.loading ) {
            this.loading = true;
            setTimeout(() => { this.loading = false; }, delay != null ? delay : 200 );
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
            if ( currTrainer.trainType == HorseSkills.SPEED ) {
                selectedHorse.speed += this.calculateTrainSpeed(selectedHorse.speed, currTrainer);
            } else if(currTrainer.trainType == HorseSkills.ENDURANCE ){
                selectedHorse.endurance += this.calculateTrainSpeed(selectedHorse.endurance, currTrainer);
            } else if(currTrainer.trainType == HorseSkills.ACCELERATION ){
                selectedHorse.acceleration += this.calculateTrainSpeed(selectedHorse.acceleration, currTrainer);
            }
        }
    }
    
    calculateTrainSpeed(skill: number, trainer: Trainer ): number {
        let trainStep = 2 / trainer.speed;
        // Dont train when horse has reacherd trainer quality.
        if(skill + trainStep  >= trainer.quality * 10)
            return 0;
        return trainStep;
    }


    saveGame(): void {
        Cookies.set( StaticData.saveGameName, this.gameInstance, { expires: 7 } );
    }

    addHorseToPlayer( horse: Horse ): boolean {
        if ( this.gameInstance.playerOne.money >= horse.price ) {
            this.gameInstance.playerOne.money -= horse.price;
            let newHorse = new Horse( this.gameInstance.playerOne.horses.length + 1, horse.name,
                horse.speed, horse.endurance, horse.acceleration, horse.form );
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
    
    setHorseName(horse: Horse, newName: string ): void {
        horse.name = newName;
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
        return new Horse( 1000 + num, name,
            ( difficulty * 5 ) + 1 + Utils.getRandomInt( 0, 6 ),
            ( difficulty * 5 ) + 2 + Utils.getRandomInt( 0, 6 ),
            ( difficulty * 5 ) + 1 + Utils.getRandomInt( 0, 6 ),
            Horse.AVG_FORM );
    }

    chargeEntranceFee( race: Race ) {
        this.gameInstance.playerOne.money -= race.entranceFee;
    }

    setInitialized() {
        this.gameInstance.initialized = true;
    }

    buyHorseSkill( player: Player, horse: TrainingHorse, trainType: number ): boolean {
        let price: number = trainType == HorseSkills.SPEED ? horse.trainSpeedPrice : horse.trainEndurancePrice;
        if ( player.money >= price ) {
            player.money -= price;
            trainType == HorseSkills.SPEED ? horse.baseHorse.speed++ : horse.baseHorse.endurance++;
            return true;
        } else {
            return false;
        }
    }

    buyTrainer( player: Player, trainer: Trainer ) {
        if ( player.money >= trainer.price ) {
            player.money -= trainer.price;
            let newTrainer = new Trainer(10 + this.gameInstance.playerOne.trainers.length,
                    trainer.name, trainer.price, trainer.salary,
                    trainer.trainType, trainer.speed, trainer.quality, trainer.description);
            this.gameInstance.playerOne.trainers.push(newTrainer);
            return true;
        } else {
            return false;
        }
    }
    
    upgradeTrainer( player: Player, trainer: Trainer ) {
        if ( player.money >= trainer.upgradePrice ) {
            player.money -= trainer.upgradePrice;
            trainer.quality +=2;
            trainer.calculateUpgradePrice();
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
            this.backgroundImage = 'url("assets/bg8bit_' + ( ( this.gameInstance.date.getDate() % 11 ) + 1 ) + '.jpg")';
        } else {
            this.backgroundImage = 'url("assets/bg8bit_7.jpg")';
        }
        this.loadBgImage( this.gameInstance.date );
    }

    loadBgImage( date: Date ) {
        if ( !Utils.devMode() ) {
            this.loadingBackground = 'url("assets/bg8bit_' + ( ( ( date.getDate() + 1 ) % 11 ) + 1 ) + '.jpg")';
        } else {
            this.loadingBackground = 'url("assets/bg8bit_7.jpg")';
        }
    }
}


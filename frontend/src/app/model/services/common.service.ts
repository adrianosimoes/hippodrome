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
import { GameConstants } from "src/app/model/services/gameconstants";
import { CurrencyPipe } from "@angular/common";


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
    xpPerLevel: number[];
    skillPointsPerLevel: number[];
    backgroundImage: SafeStyle;
    loadingBackground: SafeStyle;
    auctionHorse: Horse;

    public loading: boolean;
    public loadingText: string;

    constructor( private router: Router, private currencyPipe: CurrencyPipe ) {
        this.horsesInShop = [];
        this.racesLeagues = [];
        this.trainersToSell = [];
        this.xpPerLevel = [];
        this.skillPointsPerLevel = [];
        
        InitService.initHorsesInShop(this.horsesInShop);
        InitService.initRaces(this.racesLeagues);
        InitService.initTrainers(this.trainersToSell);
        InitService.initXPPerLevel(this.xpPerLevel);
        InitService.initSkillPointsPerLevel(this.skillPointsPerLevel);
        
        this.loading = false;

        let savedGameString: string = Cookies.get( GameConstants.saveGameName );
        if ( savedGameString ) {
            this.loadToSavedSlot( savedGameString );
        }

        let playerOne = new Player( 1, '', '#1281f1', '#feda10',
            0, Utils.devMode() ? 105000 : GameConstants.INITIAL_MONEY );
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
            newTrainer.trainingHorseId = trainersJson[i].trainingHorseId;
            this.savedGame.playerOne.trainers.push(newTrainer);
        }
        
    }

    loadSavedGame(): void {
        this.gameInstance = this.savedGame;
        this.loadBgImage( this.savedGame.date );
    }

    getHorsesInShop(): Horse[] {
        return this.horsesInShop;
    }
    
    getNextXPLevel(player: Player): number {
        return this.xpPerLevel[this.gameInstance.playerOne.playerLevel + 1];
    }
    
    getSkillPoints(player: Player): number {
        return this.skillPointsPerLevel[this.gameInstance.playerOne.playerLevel];
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
        for ( let currTrainer of this.gameInstance.playerOne.trainers ) {
            let trainHorse: Horse = this.getHorseByID(currTrainer.trainingHorseId);

            //Pay salary:
            player.money -= currTrainer.salary;
            
            if(!trainHorse){
                continue;
            }
            
            if ( currTrainer.trainType == HorseSkills.SPEED ) {
                trainHorse.speed += this.calculateTrainSpeed(trainHorse.speed, currTrainer);
            } else if(currTrainer.trainType == HorseSkills.ENDURANCE ){
                trainHorse.endurance += this.calculateTrainSpeed(trainHorse.endurance, currTrainer);
            } else if(currTrainer.trainType == HorseSkills.ACCELERATION ){
                trainHorse.acceleration += this.calculateTrainSpeed(trainHorse.acceleration, currTrainer);
            }
            trainHorse.recalculatePrice();
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
        Cookies.set( GameConstants.saveGameName, this.gameInstance, { expires: 7 } );
    }
    
    addHorseToPlayer( horse: Horse): boolean {
        return this.addHorseWithPriceToPlayer(horse, horse.price);
    }

    addHorseWithPriceToPlayer( horse: Horse, horsePrice: number ): boolean {
        if ( this.gameInstance.playerOne.money >= horsePrice ) {
            this.gameInstance.playerOne.money -= horsePrice;
            let newHorse = new Horse( this.gameInstance.playerOne.getNewHorseId(), horse.name,
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
    
    getHorseByID(horseId: number): Horse {
        for ( let currHorse of this.gameInstance.playerOne.horses ) {
            if ( currHorse.id === horseId) {
                return currHorse;
            }
        }
        return null;
    }

    getSelectedHorse(): Horse {
       return this.getHorseByID(this.gameInstance.playerOne.selectedHorseId); 
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
            // Auto-set to train first horse:
            if( this.gameInstance.playerOne.horses.length > 0){
                newTrainer.setTrainingHorse(this.gameInstance.playerOne.horses[0]);
            }
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

    sellHorse( player: Player, horse: Horse, price: number ) {
        let index = player.horses.indexOf( horse, 0 );
        let horseId;
        if ( index > -1 ) {
            player.horses.splice( index, 1 )
            player.money += price;
            horseId = horse.id;
            for ( let currTrainer of this.gameInstance.playerOne.trainers ) {
                if ( currTrainer.trainingHorseId == horse.id ) {
                    currTrainer.trainingHorseId = -1;
                }
            }
        }
        if (player.selectedHorseId == horseId ) {
            let newSelectedHorse = -1;
            if(player.horses.length >= 1){
                newSelectedHorse = player.horses[0].id;
            }
            player.selectedHorseId = newSelectedHorse;
        }
    }

    setAuctionHorse( auctionHorse: Horse ) {
        this.auctionHorse = auctionHorse;
    }

    getAuctionHorse(): Horse {
        return this.auctionHorse;
    }

    ownHorseAuction( auctionHorse: Horse ): number {
        var realBid = this.calculateBid( auctionHorse );
        if ( realBid > 0 ) {
            this.sellHorse( this.getPlayer(), auctionHorse, realBid );
        }
        return realBid;
    }

    bidAuction( bidValue: number, auctionHorse: Horse ): [boolean, number] {
        let retValue: [boolean, number];
        if ( bidValue > 0 && bidValue > this.getPlayer().money ) {
            retValue = [false, -1];
            return retValue;
        }

        var realBid = this.calculateBid( auctionHorse );
        if ( bidValue >= realBid ) {
            this.addHorseWithPriceToPlayer( auctionHorse, bidValue );
            retValue = [true, bidValue];
            return retValue;
        } else {
            retValue = [false, realBid];
            return retValue;
        }
    }

    calculateBid( auctionHorse: Horse ): number {
        let minValue: number = auctionHorse.price * GameConstants.AUCTION_NOT_OWNED_MIN_PRICE;
        let maxValue: number = auctionHorse.price * GameConstants.AUCTION_NOT_OWNED_MAX_PRICE;

        if ( auctionHorse.owned ) {
            minValue = auctionHorse.price * GameConstants.AUCTION_OWNED_MIN_PRICE;
            maxValue = auctionHorse.price * GameConstants.AUCTION_OWNED_MAX_PRICE;
        }

        return Utils.getRandomInt( minValue, maxValue );
    }

    isInitialized(): boolean {
        return this.gameInstance.initialized;
    }

    priceFormat( value: number ): string {
        return this.currencyPipe.transform( value, 'EUR', 'symbol', '1.0-0' )
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



import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { InitService } from './init.service';
import { GameInstance } from '../gameinstance';
import { Utils, StaticData, TrackingUtils } from '../utils';
import { Player } from '../player';
import { Horse, TrainingHorse, HorseSkills, HorseForm } from '../horse';
import { Race, } from '../race';
import { Trainer } from '../trainer';
import { GameConstants } from 'src/app/model/services/gameconstants';
import { CurrencyPipe } from '@angular/common';
import { League, LeagueDay } from 'src/app/model/league';
import { RaceInstance } from 'src/app/model/raceinstance';


declare let Cookies: any;
declare let JSON: any;

@Injectable( {
    providedIn: 'root'
} )
export class CommonService {

    horsesInShop: Horse[];
    trainersToSell: Trainer[];
    gameInstance: GameInstance;
    savedGame: GameInstance;
    seasonDefinition: number[];
    xpPerLevel: number[];
    skillPointsPerLevel: number[];
    backgroundImage: SafeStyle;
    loadingBackground: SafeStyle;
    auctionHorse: Horse;

    public loading: boolean;
    public loadingText: string;

    constructor(private currencyPipe: CurrencyPipe, private utils: TrackingUtils) {
        this.horsesInShop = [];
        this.trainersToSell = [];
        this.xpPerLevel = [];
        this.skillPointsPerLevel = [];

        InitService.initHorsesInShop( this.horsesInShop );
        InitService.initTrainers( this.trainersToSell );
        InitService.initXPPerLevel( this.xpPerLevel );
        InitService.initSkillPointsPerLevel( this.skillPointsPerLevel );
        this.seasonDefinition = GameConstants.SEASON_DEFINITION;

        this.loading = false;

        const savedGameString: string = localStorage.getItem( GameConstants.saveGameName );
        if ( savedGameString ) {
            this.loadToSavedSlot( savedGameString );
        }

        const playerOne = new Player( 1, '', '#1281f1', '#feda10',
            0, Utils.devMode() ? 100000 + GameConstants.INITIAL_MONEY : GameConstants.INITIAL_MONEY );
        this.gameInstance = new GameInstance();
        this.gameInstance.init( playerOne, new Date( '2019-01-06' ), false );
        this.generateBgImage();

        this.gameInstance.leagues = [];
        InitService.initRaces( this.gameInstance.leagues );
        playerOne.leagueId = this.gameInstance.leagues[0].id;
    }

    loadToSavedSlot( savedGameString: string ): void {
        this.savedGame = new GameInstance();
        this.savedGame.load( JSON.parse( savedGameString ) );
    }

    loadSavedGame(): void {
        this.gameInstance = this.savedGame;
        this.loadBgImage( this.savedGame.date );
    }

    getHorsesInShop(): Horse[] {
        return this.horsesInShop;
    }

    getThisWeekRaceIndex() {
        return this.seasonDefinition[this.gameInstance.weekNumber % this.seasonDefinition.length];
    }

    getWeekDescription(): string {
        const weekValue = this.seasonDefinition[this.gameInstance.weekNumber % this.seasonDefinition.length];
        if ( weekValue >= 0 ) {
            return 'Race ' + ( weekValue + 1 );
        } else if ( weekValue == LeagueDay.NO_RACE ) {
            return 'Rest week';
        } else if ( weekValue == LeagueDay.END_OF_SEASON_DAY_1 || weekValue == LeagueDay.END_OF_SEASON_DAY_2 ) {
            return 'End of season week ' + ( -weekValue );
        }
    }

    getNextXPLevel( player: Player ): number {
        return this.xpPerLevel[this.gameInstance.playerOne.playerLevel + 1];
    }

    getSkillPoints( player: Player ): number {
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
        this.utils.trackEvent( 'exhibition', 'Exhibition:' + this.gameInstance.playerOne.money );
        this.gameInstance.playerOne.money += 100;
        this.nextWeek( null );
        this.loadingText = 'You participated in a exhibition and earned 100 €. \n Waiting 5 seconds.';
        setTimeout(() => {
            this.loading = false; this.loadingText = '';
        }, 5000 );
    }

    updateLeagues() {
        for ( let i = 0; i < this.gameInstance.leagues.length; i++ ) {
            if ( this.gameInstance.leagues[i].id !== this.gameInstance.playerOne.leagueId ) {
                const raceIndex = this.getThisWeekRaceIndex();
                if ( raceIndex >= 0 ) {
                    this.simulateRace( this.gameInstance.leagues[i], this.gameInstance.leagues[i].races[raceIndex], false );
                }
            }
            Utils.stableSort( this.gameInstance.leagues[i].teamsInLeague, ( t1, t2 ) => t2.points - t1.points );
        }
    }

    checkInitLeagues() {
        const shouldRestart = ( this.gameInstance.weekNumber % this.seasonDefinition.length ) == 0;

        // Apply promotions / demotions:
        for ( let i = 0; i < this.gameInstance.leagues.length; i++ ) {
            if ( shouldRestart && this.gameInstance.leagues[i].teamsInLeague.length > 0 && this.getPlayer().leagueId == this.gameInstance.leagues[i].id ) {
                // Check promotion on all leagues except World Championship (last):
                if ( i < this.gameInstance.leagues.length - 1 && ( this.gameInstance.leagues[i].teamsInLeague[0].isPlayer || this.gameInstance.leagues[i].teamsInLeague[1].isPlayer ) ) {
                    this.getPlayer().leagueId = this.gameInstance.leagues[i + 1].id;
                    break;
                } // Check demotion on all leagues, excepct first (lower level)
                else if ( i > 0 && ( this.gameInstance.leagues[i].teamsInLeague[6].isPlayer || this.gameInstance.leagues[i].teamsInLeague[7].isPlayer) ) {
                    this.getPlayer().leagueId = this.gameInstance.leagues[i - 1].id;
                    break;
                }
            }
        }

        for ( let i = 0; i < this.gameInstance.leagues.length; i++ ) {
            if ( !this.gameInstance.leagues[i].isInitialized() || shouldRestart ) {
                this.gameInstance.leagues[i].restartLeague( this );
            }
            Utils.stableSort( this.gameInstance.leagues[i].teamsInLeague, ( t1, t2 ) => t2.points - t1.points );
        }
    }

    simulateRace( league: League, race: Race, isOwnRace: boolean ) {
        const currRaceInstance = new RaceInstance( race, this, this.utils, league.teamsInLeague, isOwnRace, true );
        currRaceInstance.startRace();
    }


    nextWeek( delay: number ): void {
        this.gameInstance.date.setDate( this.gameInstance.date.getDate() + 7 );
        this.gameInstance.weekNumber++;
        this.generateBgImage();
        if ( !this.loading ) {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
            }, delay != null ? delay : 200 );
        }

        this.checkInitLeagues();

        /// Only copied date is updated in the interface.
        this.gameInstance.date = new Date( this.gameInstance.date );
        this.applyTrainers( this.gameInstance.playerOne );
        for ( const currHorse of this.gameInstance.playerOne.horses ) {
            currHorse.calculateForm();
            currHorse.updateDaillyFitness();
        }
        this.saveGame();
    }

    applyTrainers( player: Player ): void {
        for ( const currTrainer of this.gameInstance.playerOne.trainers ) {
            const trainHorse: Horse = this.getHorseByID( currTrainer.trainingHorseId );

            // Pay salary:
            player.money -= currTrainer.salary;

            if ( !trainHorse ) {
                continue;
            }

            if ( currTrainer.trainType == HorseSkills.SPEED ) {
                trainHorse.speed += this.calculateTrainSpeed( trainHorse.speed, currTrainer );
            } else if ( currTrainer.trainType == HorseSkills.ENDURANCE ) {
                trainHorse.endurance += this.calculateTrainSpeed( trainHorse.endurance, currTrainer );
            } else if ( currTrainer.trainType == HorseSkills.ACCELERATION ) {
                trainHorse.acceleration += this.calculateTrainSpeed( trainHorse.acceleration, currTrainer );
            }
            trainHorse.recalculatePrice();
        }
    }

    calculateTrainSpeed( skill: number, trainer: Trainer ): number {
        const trainStep = ( 2.5 / trainer.speed );
        // Dont train when horse has reacherd trainer quality.
        if ( skill + trainStep >= trainer.quality * 10 ) {
            return 0;
        }
        return trainStep;
    }


    saveGame(): void {
        localStorage.setItem( GameConstants.saveGameName, JSON.stringify( this.gameInstance ) );
    }

    addHorseToPlayer( horse: Horse ): boolean {
        return this.addHorseWithPriceToPlayer( horse, horse.price );
    }

    addHorseWithPriceToPlayer( horse: Horse, horsePrice: number ): boolean {
        if ( this.gameInstance.playerOne.money >= horsePrice ) {
            this.gameInstance.playerOne.money -= horsePrice;
            const newHorse = new Horse( this.gameInstance.playerOne.getNewHorseId(), horse.name,
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

    getHorseByID( horseId: number ): Horse {
        for ( const currHorse of this.gameInstance.playerOne.horses ) {
            if ( currHorse.id === horseId ) {
                return currHorse;
            }
        }
        return null;
    }

    getSelectedHorse(): Horse {
        return this.getHorseByID( this.gameInstance.playerOne.selectedHorseId );
    }

    setHorseName( horse: Horse, newName: string ): void {
        horse.name = newName;
    }

    getRace( raceId: number ): Race {
        for ( const raceLeague of this.gameInstance.leagues ) {
            for ( const race of raceLeague.races ) {
                if ( race.id == raceId ) {
                    return race;
                }
            }
        }
        return null;
    }

    getLeague( raceId: number ): League {
        for ( const raceLeague of this.gameInstance.leagues ) {
            for ( const race of raceLeague.races ) {
                if ( race.id == raceId ) {
                    return raceLeague;
                }
            }
        }
        return null;
    }

    getCurrentLeague(): League {
        for ( const league of this.gameInstance.leagues ) {
            if ( league.id == this.getPlayer().leagueId ) {
                return league;
            }
        }
        return null;
    }

    getRandomDifferentItems( numberOfItems: number, baseItems: string[] ): string[] {
        const items: string[] = [];

        for ( let i = 0; i < numberOfItems; i++ ) {
            let currItem: string;
            do {
                currItem = baseItems[Utils.getRandomInt( 0, baseItems.length - 1 )];
            }
            while ( items.includes( currItem ) );
            items.push( currItem );
        }
        return items;
    }

    createRandomHorse( name: string, num: number, difficulty: number, totalHorses: number ): Horse {
        let speed: number = ( difficulty * 5 ) + Utils.getRandomInt( 2, 7 );
        let endurance: number = ( difficulty * 5 ) + Utils.getRandomInt( 2, 8 );
        let acceleration: number = ( difficulty * 5 ) + Utils.getRandomInt( 2, 8 );

        // The last 2 horses should be weaker speed and acc. (and high endurance so they are never too behind).
        if ( num >= totalHorses - 2 ) {
            speed = ( difficulty * 5 ) + Utils.getRandomInt( 2, 3 );
            endurance = ( difficulty * 5 ) + Utils.getRandomInt( 5, 8 );
            acceleration = ( difficulty * 5 ) + Utils.getRandomInt( 1, 5 );
            // console.log( "Generated horse:" + name + speed + "; " + acceleration + "; " + endurance );
        }

        return new Horse( 1000 + num, name,
            speed,
            endurance,
            acceleration,
            HorseForm.AVERAGE );
    }

    setInitialized() {
        this.checkInitLeagues();
        this.gameInstance.initialized = true;
    }

    buyHorseSkill( player: Player, horse: TrainingHorse, trainType: number ): boolean {
        const price: number = trainType == HorseSkills.SPEED ? horse.trainSpeedPrice : horse.trainEndurancePrice;
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
            const newTrainer = new Trainer( 10 + this.gameInstance.playerOne.trainers.length,
                trainer.name, trainer.price, trainer.salary,
                trainer.trainType, trainer.speed, trainer.quality, trainer.description );
            this.gameInstance.playerOne.trainers.push( newTrainer );
            // Auto-set to train first horse:
            if ( this.gameInstance.playerOne.horses.length > 0 ) {
                newTrainer.setTrainingHorse( this.gameInstance.playerOne.horses[0] );
            }
            return true;
        } else {
            return false;
        }
    }

    upgradeTrainer( player: Player, trainer: Trainer ) {
        if ( player.money >= trainer.upgradePrice ) {
            player.money -= trainer.upgradePrice;
            trainer.quality += 2;
            trainer.calculateUpgradePrice();
            return true;
        } else {
            return false;
        }
    }

    sellTrainer( player: Player, trainer: Trainer ) {
        const index = player.trainers.indexOf( trainer, 0 );
        if ( index > -1 ) {
            player.trainers.splice( index, 1 );
            player.money += trainer.price / 2;
        }
    }

    sellHorse( player: Player, horse: Horse, price: number ) {
        const index = player.horses.indexOf( horse, 0 );
        let horseId;
        if ( index > -1 ) {
            player.horses.splice( index, 1 );
            player.money += price;
            horseId = horse.id;
            for ( const currTrainer of this.gameInstance.playerOne.trainers ) {
                if ( currTrainer.trainingHorseId == horse.id ) {
                    currTrainer.trainingHorseId = -1;
                }
            }
        }
        if ( player.selectedHorseId == horseId ) {
            let newSelectedHorse = -1;
            if ( player.horses.length >= 1 ) {
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
        const realBid = this.calculateBid( auctionHorse );
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

        const realBid = this.calculateBid( auctionHorse );
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
        return this.currencyPipe.transform( value, 'EUR', 'symbol', '1.0-0' );
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



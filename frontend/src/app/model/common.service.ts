import { Injectable } from '@angular/core';
import { GameInstance } from './gameinstance';
import { Player } from './player';
import { Horse, getRandomInt } from './horse';
import { Race } from './race';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    gameInitialized: boolean = false;
    horsesInShop: Horse[] = [];
    races: Race[] = [];
    gameInstance: GameInstance;
    playerOne: Player;
    nextHorseID: number;
    horseNames: string[] = ['Annabel', 'Swiftbolt', 'Pocaroo', 'Graceland', 'Darkheart', 'Onix', 'Sugarbolt', 'Colby',
        'Shah', 'Sancho', 'Brandy', 'Webster', 'Galadriel', 'Logan', 'Watson', 'Fidget', 'Explorer', 'Wiley', 'Khan',
        'Sid', 'Izzy', 'Ishtar', 'Frendor', 'Mikan', 'Creed', 'Fafnir', 'Andana']

    constructor() {
        this.initHorsesInShop();
        this.initRaces();

        this.gameInstance = { date: new Date() };

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
        let horse = new Horse(1, 'Mayana Bolt', 11, 20, 4000, 3);
        this.horsesInShop.push(horse);

        horse = new Horse(2, 'Elmer Steel', 8, 25, 4000, 3);
        this.horsesInShop.push(horse);

        horse = new Horse(3, 'Caspian Grey', 15, 14, 4000, 3);
        this.horsesInShop.push(horse);

        horse = new Horse(4, 'Scarlett Diamond', 14, 20, 4500, 3);
        this.horsesInShop.push(horse);

        horse = new Horse(4, 'Aeria King', 11, 25, 4500, 3);
        this.horsesInShop.push(horse);
        this.nextHorseID = 5;
    }

    initRaces(): void {
        let race = new Race(1, 'Hurst Park Racecourse', 750, '#338833', 10, [32, 15, 7]);
        this.races.push(race);

        race = new Race(2, 'Shirley Racecourse', 600, '#338833', 20, [64, 30, 14]);
        this.races.push(race);
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
        this.gameInstance.date.setDate(this.gameInstance.date.getDate() + 1);
        ///Only copied date is updated in the interface.
        this.gameInstance.date = new Date(this.gameInstance.date);
        for (let currHorse in this.playerOne.horses) {
            this.playerOne.horses[0].calculateForm();
        }
    }

    addHorseToPlayer(horse: Horse): boolean {
        if (this.playerOne.money >= horse.price) {
            this.playerOne.money -= horse.price;
            let newHorse = new Horse(this.nextHorseID++, horse.name, horse.speed, horse.stamina, horse.price, horse.form);
            newHorse.owned = true;
            newHorse.calculateForm();
            this.playerOne.horses.push(newHorse);
            return true;
        }
        return false;
    }

    getRace(raceId: number): Race {
        return this.races[raceId - 1];
    }

    createRandomHorse(num: number): Horse {
        let rnd: number = getRandomInt(0, this.horseNames.length)
        let name: string = this.horseNames[rnd];
        return new Horse(1000 + num, name, 11, 20, 0, 4);
    }

    randomizeArray(a): void {//array,placeholder,placeholder,placeholder
        let b, c, d;
        c = a.length; while (c) b = Math.random() * (--c + 1) | 0, d = a[c], a[c] = a[b], a[b] = d;
    }

}

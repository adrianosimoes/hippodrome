import { Injectable } from '@angular/core';
import { GameInstance } from './gameinstance';
import { Player } from './player';
import { Horse } from './horse';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    gameInitialized: boolean = false;
    horsesInShop: Horse[] = [];
    gameInstance: GameInstance;
    playerOne: Player;
    nextHorseID: number;

    constructor() {
        this.initHorsesInShop();

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

}

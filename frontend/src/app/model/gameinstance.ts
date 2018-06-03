import { Player } from './player';

export class GameInstance {
    name: string;
    date: Date;
    initialized: boolean;
    playerOne: Player;

    constructor( player: Player, date: Date, initialized: boolean ) {
        this.playerOne = player;
        this.date = date;
        this.initialized = initialized;
    }
}
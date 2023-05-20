import { LeagueDay } from 'src/app/model/league';

export class GameConstants {

    static INITIAL_MONEY = 6000;

    static SEASON_DEFINITION: number[] = [0, 1, LeagueDay.NO_RACE, 2, 3, LeagueDay.END_OF_SEASON_DAY_1, LeagueDay.END_OF_SEASON_DAY_2];

    static BASE_XP = 60;

    static MAX_SILK_ID = 13;

    static AUCTION_NOT_OWNED_MIN_PRICE = 0.9;
    static AUCTION_NOT_OWNED_MAX_PRICE = 1.15;

    static AUCTION_OWNED_MIN_PRICE = 0.85;
    static AUCTION_OWNED_MAX_PRICE = 1.10;

    static BORDER_HEIGHT = 2;

	 static saveGameName = 'gamev12';
}

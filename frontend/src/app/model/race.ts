export class Race {
    static CURVE_RACE_MIN_DISTANCE = 700;
    static RACETRACK_HEIGHT = 16;
    static ROUND_TRACK_BOTTOM_DISTANCE = 440;
    static ROUND_TRACK_HORSE_CURVE = 38;
    static AFTER_END_RACE_PIXELS = 35;


    id: number;
    difficulty: number;
    name: string;
    distance: number;
    color: string;
    entranceFee: number;
    numHorses: number;
    prizes: number[];

    constructor( id: number, difficulty: number, name: string, distance: number, color: string, entranceFee: number, numHorses: number, prizes: number[] ) {
        this.id = id;
        this.difficulty = difficulty;
        this.name = name;
        this.distance = distance;
        this.color = color;
        this.entranceFee = entranceFee;
        this.prizes = prizes;
        this.numHorses = numHorses;
    }
}






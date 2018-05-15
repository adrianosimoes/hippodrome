export class Race {
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

export class RaceLeague {
    difficulty: number;
    name: string;
    races: Race[]
    
    constructor( difficulty: number, name: string){
        this.difficulty = difficulty;
        this.name = name;
        this.races = [];
    }

    addRace(race: Race) : void {
        this.races.push(race);
    }
}




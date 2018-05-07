export class Race {
    id: number;
    name: string;
    distance: number;
    color: string;
    entranceFee: number;
    prizes: number[];
    
     constructor(id: number, name: string, distance: number, color: string, entranceFee: number, prizes: number[]) {
        this.id = id;
        this.name = name;
        this.distance = distance;
        this.color = color;
        this.entranceFee = entranceFee;
        this.prizes = prizes;
    }
}

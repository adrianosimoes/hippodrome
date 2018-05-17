export class Utils {

    static getRandomInt( initial: number, max: number ): number {
        return Math.floor(( Math.random() * ( max - initial + 1 ) ) + initial );
    }

    static randomizeArray( a ): void {
        let b, c, d;
        c = a.length; while ( c ) b = Math.random() * ( --c + 1 ) | 0, d = a[c], a[c] = a[b], a[b] = d;
    }

    static stableSort<T>( self: T[], cmp: Comparator<T> = defaultCmp ): T[] {
        let stabilized = self.map(( el, index ) => <[T, number]>[el, index] );
        let stableCmp: Comparator<[T, number]> = ( a, b ) => {
            let order = cmp( a[0], b[0] );
            if ( order != 0 ) return order;
            return a[1] - b[1];
        }

        stabilized.sort( stableCmp );
        for ( let i = 0; i < self.length; i++ ) {
            self[i] = stabilized[i][0];
        }

        return self;

    }

    static precisionRound( number, precision ) {
        var factor = Math.pow( 10, precision );
        return Math.round( number * factor ) / factor;
    }

    static devMode() {
        return window.location.href.startsWith( "http://localhost", 0 );
    }

}

interface Comparator<T> {
    ( a: T, b: T ): number
}

let defaultCmp: Comparator<any> = ( a, b ) => {
    if ( a < b ) return -1;
    if ( a > b ) return 1;
    return 0;
}

export class StaticData {
    static horseNames: string[] = ['Annabel', 'Swiftbolt', 'Pocaroo', 'Graceland', 'Darkheart', 'Onix', 'Sugarbolt', 'Colby',
        'Shah', 'Sancho', 'Brandy', 'Webster', 'Galadriel', 'Logan', 'Watson', 'Fidget', 'Explorer', 'Wiley', 'Khan',
        'Sid', 'Izzy', 'Ishtar', 'Frendor', 'Mikan', 'Creed', 'Fafnir', 'Andana', 'Hindoo', 'Agile', 'Ferdinand',
        'Donerail', 'Donau', 'Meridian', 'Azra', 'Worth', 'Fonso', 'Giacomo'];

    static colors: string[] = [
                            /*Reds and yellows:*/ '#ff0000', '#ff00ff', '#FA8072', '#800000', '#800080', '#ff6600', '#8B0000',
                           /* Yellows */ '#f7cda8', '#EDDA74', '#c5c54f', '#FBB117', '#C2B280', '#C58917',
                            /*Greens */ '#00ff00', '#aaaa00', '#808000', '#00dddd', '#556B2F', '#6B8E23',
                            /* Blues */  '#000080',
                            /* Grey and Brown */ '#000000', '#999999', '#966F33', '#6F4E37', '#7F5217'];
    
    static saveGameName: string ="gamev2";
}



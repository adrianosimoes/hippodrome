declare var clicky: any;

export class Utils {

    static getRandomInt( initial: number, max: number ): number {
        return Math.floor(( Math.random() * ( max - initial + 1 ) ) + initial );
    }

    static clickyPagView( url: string, name: string ) {
        try {
            clicky.log( '/' + url, name, 'pageview' );
        } catch ( e ) { };
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
        return window.location.href.startsWith( "http://127.0.0.1", 0 );
    }

    static calculateDisplayStamina( speed: number, maxSpeed: number, baseValue: number ): number {
        return baseValue - ( speed - ( maxSpeed / 2 ) ) /
            ( maxSpeed - ( maxSpeed / 2 ) ) * baseValue;
    }

    static getCssBackground( color: string, secColor: string, silkType: number ): string {
        if ( silkType == 2 ) {
            return color; //use simple color.
        } else if ( silkType == 0 ) {
            return 'repeating-linear-gradient( 0deg, ' +
                color + ' , ' + color + ' 40px, ' + secColor + ' 40px , ' + secColor + ' 80px )';
        } else if ( silkType == 1 ) {
            return 'repeating-linear-gradient( 90deg, ' +
                color + ' , ' + color + ' 38px, ' + secColor + ' 38px , ' + secColor + ' 80px )';
        } else if ( silkType == 3 ) {
            return 'repeating-linear-gradient( 45deg, ' +
                color + ' , ' + color + ' 40px, ' + secColor + ' 40px , ' + secColor + ' 80px )';
        } else if ( silkType == 4 ) {
            return 'repeating-linear-gradient( 135deg, ' +
                color + ' , ' + color + ' 40px, ' + secColor + ' 40px , ' + secColor + ' 80px )';
        } else if ( silkType == 5 ) {
            return 'repeating-radial-gradient( circle, ' +
                color + ' , ' + color + ' 20px, ' + secColor + ' 20px , ' + secColor + ' 120px )';
        } else if ( silkType == 6 ) {
            return 'repeating-radial-gradient( circle, ' +
                color + ' , ' + color + ' 45px, ' + secColor + ' 45px , ' + secColor + ' 120px )';
        } else if ( silkType == 7 ) {
            return 'repeating-linear-gradient( 90deg, ' +
                color + ' , ' + color + ' 100px, ' + secColor + ' 100px , ' + secColor + ' 200px )';
        } else if ( silkType == 8 ) {
            return 'repeating-linear-gradient( 0deg, ' +
                color + ' , ' + color + ' 100px, ' + secColor + ' 100px , ' + secColor + ' 200px )';
        } else if ( silkType == 9 ) {
            return 'repeating-linear-gradient( 45deg, ' +
                color + ' , ' + color + ' 100px, ' + secColor + ' 100px , ' + secColor + ' 200px )';
        } else if ( silkType == 10 ) {
            return 'repeating-linear-gradient( 135deg, ' +
                color + ' , ' + color + ' 100px, ' + secColor + ' 100px , ' + secColor + ' 200px )';
        } else if ( silkType == 11 ) {
            return 'repeating-linear-gradient( 90deg, ' +
                color + ' , ' + color + ' 20px, ' + secColor + ' 20px , ' + secColor + ' 40px )';
        } else if ( silkType == 12 ) {
            return 'repeating-linear-gradient( 0deg, ' +
                color + ' , ' + color + ' 20px, ' + secColor + ' 20px , ' + secColor + ' 40px )';
        } else if ( silkType == 13 ) {
            return 'repeating-linear-gradient( 45deg, ' +
                color + ' , ' + color + ' 20px, ' + secColor + ' 20px , ' + secColor + ' 40px )';
        } else if ( silkType == 12 ) {
            return 'repeating-linear-gradient( 135deg, ' +
                color + ' , ' + color + ' 20px, ' + secColor + ' 20px , ' + secColor + ' 40px )';
        }
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
    static horseNames: string[] = ['Annabel', 'Adagio', 'Aida', 'Dale', 'Lacey', 'Russel', 'Spirit', 'Onyx', 'Swiftbolt', 'Pocaroo', 'Graceland', 'Darkheart', 'Sugarbolt', 'Colby',
        'Shah', 'Sancho', 'Brandy', 'Webster', 'Galadriel', 'Logan', 'Watson', 'Fidget', 'Explorer', 'Wiley', 'Khan',
        'Sid', 'Izzy', 'Ishtar', 'Frendor', 'Mikan', 'Creed', 'Fafnir', 'Andana', 'Hindoo', 'Agile', 'Ferdinand',
        'Donerail', 'Donau', 'Meridian', 'Azra', 'Worth', 'Fonso', 'Giacomo', 'Velvet', 'Verona', 'Vegas', 'Virgo'];

    static colors: string[] = [
                            /*Reds:*/ '#ff0000', '#ff00ff', '#FA8072', '#800080', '#ff6600', '#9e0000',
                           /* Yellows */ '#d0b93d', '#FBB117', '#C58917',
                            /*Greens */ '#00ff00', '#00dddd', '#556B2F', '#6B8E23',
                            /* Blues */  '#2f2fc7',
                            /* Grey and Brown */ '#000000', '#999999'];

    static teamNames: string[] = ['Racing', 'Stables', 'Team'];

}



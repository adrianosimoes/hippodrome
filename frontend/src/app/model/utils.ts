export class Utils {
    
    static getRandomInt(initial: number, max: number) : number {
        return Math.floor((Math.random() * max + initial) + initial);
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
    
    static devMode(){
       return window.location.href.startsWith("http://localhost", 0);
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



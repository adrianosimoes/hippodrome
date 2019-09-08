import { TestBed, inject } from '@angular/core/testing';

import { CommonService } from './services/common.service';
import { Horse } from './horse';
import { RaceInstance, RaceState } from './raceinstance';
import { Race } from './race';
import { delay } from "q";

describe( 'RaceInstance', () => {
    let commonService: CommonService;
    let testRace: Race;

    beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate();
        commonService = new CommonService( null );
     
        testRace = new Race( 1, 2, 'Colwall Park', 400, '#338833', 100, 6, [1000, 450, 200] );
    } );
    
    function setTestHorse(speed : number) : void {
        commonService.gameInstance.playerOne.horses = [];
        commonService.gameInstance.playerOne.horses.push( new Horse( 103, 'Sandra Test', speed, 13, 10, Horse.AVG_FORM ) );
        commonService.gameInstance.playerOne.selectedHorseId = 103;
    }

    afterEach( function() {
        jasmine.clock().uninstall();
    } );

    it( 'Test race instance creation', () => {
        setTestHorse(90);
        let raceInstance = new RaceInstance( testRace, commonService );
        expect( raceInstance.state ).toBe( RaceState.PreRace );
        expect( raceInstance.horses.length ).toBe( 6 );
        expect( raceInstance.roundTrack ).toBe( false );
        expect( raceInstance.comments.length ).toBe( 0 );
        expect( raceInstance.playerHorse.staminaDisplay ).toBe( 0 );
    } );

    it( 'Test race instance finish first', () => {
        setTestHorse(90);
        let raceInstance = new RaceInstance( testRace, commonService );
        let startMoney: number = commonService.gameInstance.playerOne.money;
        raceInstance.startTimeout = 0;
        raceInstance.tickTime = 1;

        expect( raceInstance.state ).toBe( RaceState.PreRace );
        expect( raceInstance.comments.length ).toBe( 0 );

        raceInstance.startRace();
        // Check entrance fee was changed:
        expect( commonService.gameInstance.playerOne.money ).toBe( startMoney - 100 );
        expect( raceInstance.comments.length ).toBe( 1 );
        expect( raceInstance.state ).toBe( RaceState.Racing );

        jasmine.clock().tick( 1000 );
        expect( raceInstance.state ).toBe( RaceState.RaceFinished );

        // Expect horse with speed 90 to win.
        expect( raceInstance.place ).toBe( 1 );
        // Check prize money was paid:
        expect( commonService.gameInstance.playerOne.money ).toBe( startMoney - 100 + 1000 );
    } );
    
    it( 'Test race instance finish last', () => {
        setTestHorse(5);
        let raceInstance = new RaceInstance( testRace, commonService );
        let startMoney: number = commonService.gameInstance.playerOne.money;
        raceInstance.startTimeout = 0;
        raceInstance.tickTime = 1;

        raceInstance.startRace();
        // Check entrance fee was changed:
        expect( commonService.gameInstance.playerOne.money ).toBe( startMoney - 100 );
        
        jasmine.clock().tick( 2000 );
        expect( raceInstance.state ).toBe( RaceState.RaceFinished );

        // Expect horse with Speed 5 to lose.
        expect( raceInstance.place ).toBe( 6 );
        // Check no prize money was paid:
        expect( commonService.gameInstance.playerOne.money ).toBe( startMoney - 100);
    } );

} );  
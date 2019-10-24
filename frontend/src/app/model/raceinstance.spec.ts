import { TestBed, inject } from '@angular/core/testing';

import { CommonService } from './services/common.service';
import { Horse, HorseInRace, HorseForm } from './horse';
import { RaceInstance, RaceState } from './raceinstance';
import { Race } from './race';
import { delay } from "q";
import { Utils } from "src/app/model/utils";

describe( 'RaceInstance', () => {
    let commonService: CommonService;
    let testRace: Race;

    beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate();
        commonService = new CommonService( null, null );

        testRace = new Race( 1, 2, 'Colwall Park', 400, '#338833', 100, 6, [1000, 450, 200] );
    } );

    function setTestHorseWithSpeed( speed: number ): void {
        commonService.gameInstance.playerOne.horses = [];
        commonService.gameInstance.playerOne.horses.push( new Horse( 103, 'Sandra Test', speed, 13, 10, HorseForm.AVERAGE ) );
        commonService.gameInstance.playerOne.selectedHorseId = 103;
    }

    function setTestHorse( speed: number, acc: number, end: number ): void {
        commonService.gameInstance.playerOne.horses = [];
        commonService.gameInstance.playerOne.horses.push( new Horse( 103, 'Sandra Test', speed, end, acc, HorseForm.AVERAGE ) );
        commonService.gameInstance.playerOne.selectedHorseId = 103;
    }

    function getTestHorse( speed: number, acc: number, end: number ): Horse {
        return new Horse( 204, 'Bot', speed, end, acc, HorseForm.AVERAGE );
    }

    afterEach( function() {
        jasmine.clock().uninstall();
    } );

    it( 'Test race instance creation', () => {
        setTestHorseWithSpeed( 90 );
        let raceInstance = new RaceInstance( testRace, commonService, []);
        expect( raceInstance.state ).toBe( RaceState.PreRace );
        expect( raceInstance.horses.length ).toBe( 1 );
        expect( raceInstance.roundTrack ).toBe( false );
        expect( raceInstance.comments.length ).toBe( 0 );
        expect( raceInstance.playerHorse.staminaDisplay ).toBe( 0 );
    } );

    it( 'Test race instance finish first', () => {
        setTestHorseWithSpeed( 90 );
        let raceInstance = new RaceInstance( testRace, commonService, [] );
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

        jasmine.clock().tick( 1500 );
        expect( raceInstance.state ).toBe( RaceState.RaceFinished );

        // Expect horse with speed 90 to win.
        expect( raceInstance.place ).toBe( 1 );
        // Check prize money was paid:
        expect( commonService.gameInstance.playerOne.money ).toBe( startMoney - 100 + 1000 );
    } );

    it( 'Test race instance finish last', () => {
        setTestHorseWithSpeed( 5 );
        let raceInstance = new RaceInstance( testRace, commonService, [] );
        
        for ( let i = 0; i < 5; i++ ) {
            let botInRace: HorseInRace = new HorseInRace( getTestHorse( 14, 18, 20 ), null, null );
            raceInstance.addHorse( botInRace );
            raceInstance.sortedHorses.push( botInRace );
            raceInstance.numberOfHorses++;
        }
        
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
        expect( commonService.gameInstance.playerOne.money ).toBe( startMoney - 100 );
    } );

    it( 'Test 500 races', () => {
        setTestHorse( 14, 20, 20 );
        let currRace = new Race( 1, 2, 'Test Race', 500, '#338833', 0, 1, [1000, 450, 200] );
        
        testHorses(currRace, getTestHorse( 14, 18, 20 ));
        
        testHorses(currRace, getTestHorse( 14, 20, 20 ));
        
        testHorses(currRace, getTestHorse( 14, 22, 20 ));
        
        testHorses(currRace, getTestHorse( 14, 24, 20 ));

    } );

    function testHorses( race: Race, bot: Horse ) {

        let numWin: number = 0, numLost: number = 0;
        let numRaces: number = 600;

        for ( let i = 0; i < numRaces; i++ ) {
            // Reset Stamina on player horse:
            commonService.gameInstance.playerOne.horses[0].staminaSpeed = commonService.gameInstance.playerOne.horses[0].speed;
            let raceInstance = new RaceInstance( race, commonService, [] );

            let botInRace: HorseInRace = new HorseInRace( bot, null, null );
            raceInstance.addHorse( botInRace );
            raceInstance.sortedHorses.push( botInRace );
            raceInstance.numberOfHorses++;

            raceInstance.startTimeout = 0;
            raceInstance.tickTime = 1;

            raceInstance.startRace();
            jasmine.clock().tick( 1600 );
            expect( raceInstance.state ).toBe( RaceState.RaceFinished );

            if ( raceInstance.place == 1 ) {
                numWin++;
            } else {
                numLost++;
            }
        }
        console.log( "Win %: " + Utils.precisionRound(( numWin / numRaces ) * 100, 0 ) );
        expect( numWin + numLost ).toBe( numRaces );
    }

} );  
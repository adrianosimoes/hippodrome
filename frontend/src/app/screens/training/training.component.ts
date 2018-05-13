import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Horse, TrainingHorse } from '../../model/horse';
import { Player } from '../../model/player';
import { CommonService } from '../../model/common.service';

@Component( {
    selector: 'app-training',
    templateUrl: './training.component.html',
    styleUrls: ['./training.component.css']
} )
export class TrainingComponent implements OnInit {
    playerTrainingHorses: TrainingHorse[];
    currPlayer: Player;

    constructor( private router: Router, private commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
        this.currPlayer = this.commonService.getPlayer();
        this.reload();
    }

    reload() {
        this.playerTrainingHorses = [];

        for ( let i = 0; i < this.currPlayer.horses.length; i++ ) {
            this.playerTrainingHorses.push( new TrainingHorse( this.currPlayer.horses[i] ) );
        }
    }

    trainSpeed( horse: TrainingHorse ): void {
        let success = this.commonService.trainHorse( this.currPlayer, horse, CommonService.TRAIN_SPEED );
        if ( success ) {
            this.commonService.nextDay();
            this.reload();
        } else {
            alert( 'Not enough money' );
        }
    }

    trainStamina( horse: TrainingHorse ): void {
        let success = this.commonService.trainHorse( this.currPlayer, horse, CommonService.TRAIN_STAMINA );
        if ( success ) {
            this.commonService.nextDay();
            this.reload();
        } else {
            alert( 'Not enough money' );
        }

    }

    mainScreen() {
        this.router.navigate( ['main'] );
    }

}

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Horse, TrainingHorse } from '../../model/horse';
import { Player } from '../../model/player';
import { Trainer } from '../../model/trainer';
import { CommonService } from '../../model/common.service';
import { Utils } from '../../model/utils';

@Component( {
    selector: 'app-training',
    templateUrl: './training.component.html',
    styleUrls: ['./training.component.css']
} )
export class TrainingComponent implements OnInit {
    playerTrainingHorses: TrainingHorse[];
    currPlayer: Player;
    trainersToSell: Trainer[];
    debug: boolean = Utils.devMode();

    constructor( private router: Router, public commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
        this.currPlayer = this.commonService.getPlayer();
        this.reload();
        this.trainersToSell = [];

        let currTrainer = new Trainer( 1, "Speed Trainer", 7500, 100, CommonService.TRAIN_SPEED, 10,
            "Trains the speed every day for the active horse. 1 speed up every 10 days." );
        this.trainersToSell.push( currTrainer );

        currTrainer = new Trainer( 2, "Endurance Trainer", 3600, 45, CommonService.TRAIN_ENDURANCE, 10,
            "Trains the endurance every day for the active horse. 1 endurance up every 10 days." );
        this.trainersToSell.push( currTrainer );
    }

    reload() {
        this.playerTrainingHorses = [];

        for ( let i = 0; i < this.currPlayer.horses.length; i++ ) {
            this.playerTrainingHorses.push( new TrainingHorse( this.currPlayer.horses[i] ) );
        }
    }

    trainSpeed( horse: TrainingHorse ): void {
        let success = this.commonService.buyHorseSkill( this.currPlayer, horse, CommonService.TRAIN_SPEED );
        if ( success ) {
            this.commonService.nextDay();
            this.reload();
        } else {
            alert( 'Not enough money' );
        }
    }

    trainEndurance( horse: TrainingHorse ): void {
        let success = this.commonService.buyHorseSkill( this.currPlayer, horse, CommonService.TRAIN_ENDURANCE);
        if ( success ) {
            this.commonService.nextDay();
            this.reload();
        } else {
            alert( 'Not enough money' );
        }

    }

    buyTrainer( trainer: Trainer ): void {
        let success = this.commonService.buyTrainer( this.currPlayer, trainer );
        if ( success ) {
            this.commonService.nextDay();
            this.reload();
        } else {
            alert( 'Not enough money' );
        }
    }

    sellTrainer( trainer: Trainer ): void {
        this.commonService.sellTrainer( this.currPlayer, trainer );
        this.commonService.nextDay();
        this.reload();
    }

    mainScreen() {
        this.router.navigate( ['main'] );
    }

}

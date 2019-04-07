import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Horse, TrainingHorse, HorseSkills } from '../../model/horse';
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
    debug: boolean = Utils.devMode();

    constructor( private router: Router, public commonService: CommonService ) { }

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
        let success = this.commonService.buyHorseSkill( this.currPlayer, horse, HorseSkills.SPEED );
        if ( success ) {
            this.commonService.nextDay(null);
            this.reload();
        } else {
            alert( 'Not enough money' );
        }
    }

    trainEndurance( horse: TrainingHorse ): void {
        let success = this.commonService.buyHorseSkill( this.currPlayer, horse, HorseSkills.ENDURANCE);
        if ( success ) {
            this.commonService.nextDay(null);
            this.reload();
        } else {
            alert( 'Not enough money' );
        }

    }

    buyTrainer( trainer: Trainer ): void {
        let success = this.commonService.buyTrainer( this.currPlayer, trainer );
        if ( success ) {
            this.commonService.nextDay(null);
            this.reload();
        } else {
            alert( 'Not enough money' );
        }
    }
    
    upgradeTrainer( trainer: Trainer ): void {
        let success = this.commonService.upgradeTrainer( this.currPlayer, trainer );
        if ( success ) {
            this.commonService.nextDay(null);
            this.reload();
        } else {
            alert( 'Not enough money' );
        }
    }

    sellTrainer( trainer: Trainer ): void {
        this.commonService.sellTrainer( this.currPlayer, trainer );
        this.commonService.nextDay(null);
        this.reload();
    }

    mainScreen() {
        this.router.navigate( ['main'] );
    }

}

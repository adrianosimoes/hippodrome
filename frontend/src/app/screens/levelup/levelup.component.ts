import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Horse, TrainingHorse } from '../../model/horse';
import { Player } from '../../model/player';
import { Trainer } from '../../model/trainer';
import { CommonService } from '../../model/services/common.service';
import { Utils } from '../../model/utils';

@Component( {
    selector: 'app-levelup',
    templateUrl: './levelup.component.html',
    styleUrls: ['./levelup.component.css']
} )
export class LevelUpComponent implements OnInit {
    currPlayer: Player;
    levelUpHorses: LevelUpHorse[];
    debug: boolean = Utils.devMode();
    newLevel: number;
    editLocked: boolean;
    baseSkillPoints: number;
    levelSkillPoints: number;
    skillPoints: number;

    constructor( private router: Router, public commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
            return;
        }
        this.currPlayer = this.commonService.getPlayer();
        this.newLevel = this.currPlayer.playerLevel;
        this.baseSkillPoints = this.currPlayer.skillPoints;
        
        this.levelUpHorses = [];
        for(let playerHorse  of this.currPlayer.horses){
            this.levelUpHorses.push(new LevelUpHorse(playerHorse));
        }
        
        if(this.currPlayer.xpPoints >= this.commonService.getNextXPLevel(this.currPlayer)){
            this.currPlayer.playerLevel++;
            this.newLevel = this.currPlayer.playerLevel;
            this.baseSkillPoints += this.commonService.getSkillPoints(this.currPlayer);
        }
        else if(this.currPlayer.skillPoints <= 0) {
            this.router.navigate( ['main'] );
        }
        
        this.levelSkillPoints = this.commonService.getSkillPoints(this.currPlayer);
        this.skillPoints = this.baseSkillPoints;
        this.editLocked=false;
    }
    
    confirm() {
        for(let horse  of this.levelUpHorses){
            horse.confirmSkillUp();
        }
        this.currPlayer.skillPoints = this.skillPoints;
        Utils.clickyPagView("levelUp", "Level Up:" + " money:" +  this.commonService.gameInstance.playerOne.money
            + " skillPoints:" +  this.currPlayer.skillPoints
            + " prestige:" +  this.commonService.gameInstance.playerOne.xpPoints
            + " victories:" +  this.commonService.gameInstance.playerOne.victories 
            + " races:" +  this.commonService.gameInstance.playerOne.totalRaces
            + " horses:" +  this.commonService.gameInstance.playerOne.horses.length);
        this.router.navigate( ['main'] );
    }
    
    reset() {
        this.editLocked=true;
        this.skillPoints = this.baseSkillPoints;
        for(let horse  of this.levelUpHorses){
            horse.reset();
        }
        this.editLocked=false;
    }
    
    upSkill( horse: LevelUpHorse, skill: string ) {
        this.editLocked = true;
        if ( this.skillPoints <= 0 ) {
            this.editLocked = false;
            return;
        }

        this.skillPoints--;
        if ( skill == 'S' )
            horse.newSpeed++;
        else if ( skill == 'A' )
            horse.newAcc++;
        else if ( skill == 'E' )
            horse.newEnd++;

        if ( this.skillPoints <= 0 )
            this.editLocked = true;
        else this.editLocked = false;
    }
}

class LevelUpHorse {
    baseHorse: Horse;
    newSpeed: number;
    newAcc: number;
    newEnd: number;

    constructor( baseHorse: Horse) {
        this.baseHorse = baseHorse;
        this.reset();
    }
    
    reset(){
        this.newSpeed = this.baseHorse.speed;
        this.newAcc = this.baseHorse.acceleration;
        this.newEnd = this.baseHorse.endurance;
    }

    confirmSkillUp(){
        this.baseHorse.speed = this.newSpeed;
        this.baseHorse.acceleration = this.newAcc;
        this.baseHorse.endurance = this.newEnd;
        this.baseHorse.recalculatePrice();
    }
}

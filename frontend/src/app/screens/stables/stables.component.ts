import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Horse, TrainingHorse } from '../../model/horse';
import { Player } from '../../model/player';
import { Trainer } from '../../model/trainer';
import { CommonService } from '../../model/services/common.service';
import { Utils } from '../../model/utils';

@Component( {
    selector: 'app-stables',
    templateUrl: './stables.component.html',
    styleUrls: ['./stables.component.css']
} )
export class StablesComponent implements OnInit {
    currPlayer: Player;
    debug: boolean = Utils.devMode();

    constructor( private router: Router, public commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
        this.currPlayer = this.commonService.getPlayer();
    }
}

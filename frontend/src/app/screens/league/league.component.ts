import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../model/services/common.service';
import { Utils } from '../../model/utils';
import { Race } from '../../model/race';
import { Player } from 'src/app/model/player';
import { League } from 'src/app/model/league';



@Component( {
    selector: 'app-league',
    templateUrl: './league.component.html',
    styleUrls: ['./league.component.css']
} )
export class LeagueComponent implements OnInit {
    currPlayer: Player;
    leagues: League[];
    nextAction: string;
    debug: boolean = Utils.devMode();

    constructor( private router: Router, public commonService: CommonService, public activeRoute: ActivatedRoute ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
            return;
        }
        this.currPlayer = this.commonService.getPlayer();
        this.leagues = this.commonService.gameInstance.leagues;
        this.nextAction = this.activeRoute.snapshot.params['action'];
    }

    next(){
        if (this.nextAction == 'nextWeek'){
            this.commonService.nextWeek(null);
            this.nextAction = 'main';
        }
        this.router.navigate( [this.nextAction] );
    }
}

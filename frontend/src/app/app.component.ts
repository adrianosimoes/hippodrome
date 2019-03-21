import { Component } from '@angular/core';
import { Player } from './model/player';
import { GameInstance } from './model/gameinstance';
import { CommonService } from './model/common.service';
import { Angulartics2Clicky } from "angulartics2/clicky";



@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
} )
export class AppComponent {
    title = 'Hippodrome';
    public commonService;

    constructor( commService: CommonService ) {
        this.commonService = commService;
    }

    ngOnInit() {
        this.commonService.getGameInstance();
    }
}

import { Component } from '@angular/core';
import { Player } from './model/player';
import { GameInstance } from './model/gameinstance';
import { CommonService } from './model/services/common.service';


@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
} )
export class AppComponent {
    title = 'The Hippodrome';
    public commonService;

    constructor( commService: CommonService ) {
        this.commonService = commService;
    }

    ngOnInit() {
        this.commonService.getGameInstance();
    }
}

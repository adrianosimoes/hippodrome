import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Horse } from '../../model/horse';
import { Player } from '../../model/player';
import { CommonService } from '../../model/services/common.service';



@Component( {
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
} )
export class ShopComponent implements OnInit {
    horses: Horse[];
    currPlayer: Player;

    constructor( private router: Router, public commonService: CommonService ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
        this.horses = this.commonService.getHorsesInShop();
        this.currPlayer = this.commonService.getPlayer();
    }

    mainScreen(): void {
        this.router.navigate( ['main'] );
    }

}

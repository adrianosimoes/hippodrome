import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Horse } from '../../model/horse';
import { Player } from '../../model/player';
import { CommonService } from '../../model/services/common.service';
import { Utils } from '../../model/utils';
import {CurrencyPipe} from '@angular/common';

@Component( {
    providers: [CurrencyPipe],
    selector: 'app-auction',
    templateUrl: './auction.component.html',
    styleUrls: ['./auction.component.css']
} )
export class AuctionComponent implements OnInit {
    currPlayer: Player;
    auctionHorse: Horse;
    bidValue: number;
    auctionResult: string;

    debug: boolean = Utils.devMode();

    constructor( private router: Router, public commonService: CommonService, private cp: CurrencyPipe ) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
        }
        this.currPlayer = this.commonService.getPlayer();
        this.auctionHorse = this.commonService.getAuctionHorse();
        this.bidValue = 0;
    }
    
    bid(){
        this.auctionResult = "";
        if(this.bidValue > 0 && this.bidValue>this.currPlayer.money){
            alert("You don't have enough money to bid " +  this.cp.transform(this.bidValue, 'EUR', 'symbol', '1.0-0') );
            return;
        }
        var result : [boolean, number] = this.commonService.bidAuction(this.bidValue, this.auctionHorse);
        if(result[0]){
            this.auctionResult = "Congratulations! You won the auction and bought " + this.auctionHorse.name  + "."
        }else{
            if(result[1]>=0){
                if(this.bidValue > 0)
                    this.auctionResult = "You didn't won the auction. "
                this.auctionResult += "The final price was " +  this.cp.transform(result[1], 'EUR', 'symbol', '1.0-0') + "."; 
            }
        }
    }
    
    mainScreen() {
        this.commonService.nextDay(null);
        this.router.navigate( ['main'] );
    }
}

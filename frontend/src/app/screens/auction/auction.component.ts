import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Horse } from '../../model/horse';
import { Player } from '../../model/player';
import { CommonService } from '../../model/services/common.service';
import { Utils } from '../../model/utils';

@Component( {
    selector: 'app-auction',
    templateUrl: './auction.component.html',
    styleUrls: ['./auction.component.css']
} )
export class AuctionComponent implements OnInit {
    currPlayer: Player;
    auctionHorse: Horse;
    bidValue: number;
    auctionResult: string;
    auctionEnded: boolean;

    debug: boolean = Utils.devMode();

    constructor( private router: Router, public commonService: CommonService) { }

    ngOnInit() {
        if ( !this.commonService.isInitialized() ) {
            this.router.navigate( ['login'] );
            return;
        }
        this.currPlayer = this.commonService.getPlayer();
        this.auctionHorse = this.commonService.getAuctionHorse();
        this.bidValue = 0;
        if (this.auctionHorse && this.auctionHorse.owned){
            this.auctionResult =  'Doing Auction...';
            setTimeout(() => {
                this.doAuction();
            }, 1000);
        };
    }

    bid(){
        this.auctionResult = '';
        if (this.bidValue > 0 && this.bidValue > this.currPlayer.money){
            alert('You don\'t have enough money to bid ' +  this.commonService.priceFormat(this.bidValue));
            return;
        }
        const result: [boolean, number] = this.commonService.bidAuction(this.bidValue, this.auctionHorse);
        if (result[0]){
            this.auctionResult = 'Congratulations! You won the auction and bought ' + this.auctionHorse.name  + '.';
        }else{
            if (result[1] >= 0){
                if (this.bidValue > 0) {
                    this.auctionResult = 'You didn\'t won the auction. ';
                }
                this.auctionResult += 'The final price was ' + this.commonService.priceFormat(result[1]) + '.';
            }
        }
        this.auctionEnded = true;
    }

    doAuction(){
        const price: number = this.commonService.ownHorseAuction(this.auctionHorse);
        this.auctionResult = this.auctionHorse.name + ' was sold for ' +  this.commonService.priceFormat(price) + '.' ;
        this.auctionEnded = true;
    }

    mainScreen() {
        this.commonService.nextWeek(null);
        this.router.navigate( ['main'] );
    }
}

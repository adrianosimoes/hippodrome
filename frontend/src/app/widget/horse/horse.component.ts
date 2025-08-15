import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../model/services/common.service';
import { Horse } from '../../model/horse';
import { Player } from '../../model/player';
import { TrackingUtils, Utils } from 'src/app/model/utils';
import { RaceInstance } from 'src/app/model/raceinstance';


@Component( {
    selector: 'horse',
    templateUrl: './horse.component.html',
    styleUrls: ['./horse.component.css']
} )
export class HorseComponent implements OnInit {
    @Input() horse: Horse;
    @Input() race: RaceInstance;
    @Input() auction: boolean;
    @Input() selectable: boolean;
    @Input() editable: boolean;
    
    playerMoney: number;

    public commonService: CommonService;

    constructor( private router: Router, private commService: CommonService, private trackingUtils:TrackingUtils) { }

    ngOnInit() {
        this.commonService = this.commService;
        this.playerMoney = this.commService.getPlayer().money;
    }

    buyHorse(): void {
        const success = this.commonService.addHorseToPlayer( this.horse );
        if ( success ) {
            this.trackingUtils.trackEvent('buyHorse', 'BuyHorse: ' + this.horse.id + ' name:' + this.horse.name);
            this.router.navigate( ['main']);
        } else {
            alert( 'Not enough money' );
        }
    }

    sellHorse(): void {
        const sellConfirm: boolean = window.confirm('Are you sure you want to sell ' +  this.horse.name + ' at Auction?');
        if (sellConfirm){
            this.commonService.setAuctionHorse(this.horse);
            this.router.navigate(['auction']);
        }
    }

    editName(): void {
        const newName: string = window.prompt( 'Please select new Horse Name', this.horse.name );
        if ( newName != null ) {
            if ( newName.length > 16 ) {
                window.alert( 'Please select a name with maximum 16 characters.' );
            } else {
                this.commonService.setHorseName( this.horse, newName );
            }
        }
    }

    selectHorse(): void {
        this.commonService.selectHorse( this.horse );
        if (this.race){
            this.race.updateSelectedHorse();
        }
    }

}

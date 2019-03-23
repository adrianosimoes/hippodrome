import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { CommonService } from '../../model/common.service';
import { Horse } from '../../model/horse';
import { Player } from '../../model/player';



@Component( {
    selector: 'horse',
    templateUrl: './horse.component.html',
    styleUrls: ['./horse.component.css']
} )
export class HorseComponent implements OnInit {
    @Input() horse: Horse;
    @Input() page: string;
    public commonService: CommonService;

    constructor( private router: Router, private commService: CommonService ) { }

    ngOnInit() {
        this.commonService = this.commService;
    }

    buyHorse(): void {
        let success = this.commonService.addHorseToPlayer( this.horse );
        if ( success ) {
            this.router.navigate( ['main'], { queryParams: { buyHorse: this.horse.id } } );
        } else {
            alert( 'Not enough money' );
        }
    }

    selectHorse(): void {
        this.commonService.selectHorse( this.horse );
    }

}

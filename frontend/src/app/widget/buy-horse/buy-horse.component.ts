import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { CommonService } from '../../model/common.service';
import { Horse } from '../../model/horse';
import { Player } from '../../model/player';



@Component({
    selector: 'horse',
    templateUrl: './buy-horse.component.html',
    styleUrls: ['./buy-horse.component.css']
})
export class BuyHorseComponent implements OnInit {
    @Input() horse: Horse;

    constructor(private router: Router, private commonService: CommonService) { }

    ngOnInit() {
    }

    buyHorse(): void {
        let success = this.commonService.addHorseToPlayer(this.horse);
        if (success) {
            this.router.navigate(['main']);
        } else {
            alert('Not enough money');
        }
    }
    
}

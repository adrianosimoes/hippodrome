import { Component, OnInit, Input } from '@angular/core';
import {Router} from "@angular/router";
import { Horse } from '../model/horse';
import { Player } from '../model/player';
import { playerOne } from '../model/repository';



@Component({
    selector: 'app-buy-horse',
    templateUrl: './buy-horse.component.html',
    styleUrls: ['./buy-horse.component.css']
})
export class BuyHorseComponent implements OnInit {
    @Input() horse: Horse;

    constructor(private router: Router) { }

    ngOnInit() {
    }

    buyHorse(): void {
        
        playerOne.addHorse(this.horse);
        this.router.navigate(['main']);
    }

}

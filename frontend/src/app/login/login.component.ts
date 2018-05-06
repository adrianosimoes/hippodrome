import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { Player } from '../model/player';
import { playerOne } from '../model/repository';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    player = playerOne;

    constructor(private router: Router) { }

    ngOnInit() {
        playerOne.id =1;
        playerOne.name =  'The McCoys';
        playerOne.color =  '#0077ee'; 
        playerOne.secColor = '#aaaaaa';
        playerOne.silkType = 2;
        playerOne.calculateBackground =  'repeating-linear-gradient (45deg,  #606dbc, #606dbc 10px,  #465298 10px, #465298 20px);';
        playerOne.horses = [];
        playerOne.money= 5000;
    }

    saveForm(): void {
        this.router.navigate(['shop']);
    }

}

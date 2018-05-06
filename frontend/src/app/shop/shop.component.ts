import { Component, OnInit } from '@angular/core';
import { Horse } from '../model/horse';
import { HORSES_IN_SHOP } from '../model/repository';


@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
    horses = HORSES_IN_SHOP;

    constructor() { }

    ngOnInit() {
    }
    
    

}

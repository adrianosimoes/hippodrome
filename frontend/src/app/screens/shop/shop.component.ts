import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Horse } from '../../model/horse';
import { CommonService } from '../../model/common.service';



@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
    horses: Horse[];

    constructor(private router: Router, private commonService: CommonService) { }

    ngOnInit() {
        this.horses = this.commonService.getHorsesInShop();
    }
    
    mainScreen(): void {
         this.router.navigate(['main']);
    }    

}

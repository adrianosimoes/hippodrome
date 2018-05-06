import { Component, OnInit } from '@angular/core';
import { Horse } from '../../model/horse';
import { CommonService } from '../../model/common.service';



@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
    horses: Horse[];

    constructor(private commonService: CommonService) { }

    ngOnInit() {
        this.horses = this.commonService.getHorsesInShop();
    }
    
    

}

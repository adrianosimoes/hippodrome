import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { Player } from '../../model/player';
import { CommonService } from '../../model/common.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    player: Player;

    constructor(private router: Router, private commonService: CommonService) { }

    ngOnInit() {
        this.player = this.commonService.getPlayer();
    }

    saveForm(): void {
        this.router.navigate(['shop']);
        this.commonService.setInitialized();
    }

}

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
    player= playerOne;
    
  constructor(private router: Router) { }

  ngOnInit() {
  }
    
    saveForm(): void {
        this.router.navigate(['main']);
    }

}

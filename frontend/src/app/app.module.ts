import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';
import { MatRadioModule } from '@angular/material';

import { FormStringPipe, RaceDifficultyPipe } from './model/pipehelpers';

import { AboutComponent } from './screens/about/about.component';
import { AuctionComponent } from "src/app/screens/auction/auction.component";
import { MainComponent } from './screens/main/main.component';
import { LoginComponent } from './screens/login/login.component';
import { ShopComponent } from './screens/shop/shop.component'; 
import { HorseComponent } from './widget//horse/horse.component';
import { RaceComponent } from './screens/race/race.component';
import { TrainingComponent } from './screens/training/training.component';
import { StablesComponent } from './screens/stables/stables.component';
import { PickRaceComponent } from './screens/pick-race/pick-race.component';
import { LevelUpComponent } from "src/app/screens/levelup/levelup.component";

import { CurrencyPipe } from "@angular/common";

@NgModule({
  declarations: [
    FormStringPipe,
    RaceDifficultyPipe,
    AppComponent,
    AboutComponent,
    AuctionComponent,
    LoginComponent,
    MainComponent,
    ShopComponent,
    HorseComponent,
    RaceComponent,
    TrainingComponent,
    StablesComponent,
    PickRaceComponent,
    LevelUpComponent
  ],
  imports: [
      BrowserModule,
      FormsModule,
      MatRadioModule,
      AppRoutingModule
  ],
  providers: [CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

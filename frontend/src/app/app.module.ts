import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';

import { FormStringPipe, RaceDifficultyPipe } from './model/pipehelpers';

import { MainComponent } from './screens/main/main.component';
import { LoginComponent } from './screens/login/login.component';
import { ShopComponent } from './screens/shop/shop.component'; 
import { HorseComponent } from './widget//horse/horse.component';
import { RaceComponent } from './screens/race/race.component';
import { TrainingComponent } from './screens/training/training.component';
import { PickRaceComponent } from './screens/pick-race/pick-race.component';


@NgModule({
  declarations: [
    FormStringPipe,
    RaceDifficultyPipe,
    AppComponent,
    LoginComponent,
    MainComponent,
    ShopComponent,
    HorseComponent,
    RaceComponent,
    TrainingComponent,
    PickRaceComponent
  ],
  imports: [
      BrowserModule,
      FormsModule,
      AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

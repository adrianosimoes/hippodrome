import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';

import { FormStringPipe } from './model/formstring';

import { MainComponent } from './screens/main/main.component';
import { LoginComponent } from './screens/login/login.component';
import { ShopComponent } from './screens/shop/shop.component'; 
import { HorseComponent } from './widget//horse/horse.component';
import { RaceComponent } from './screens/race/race.component';
import { TrainingComponent } from './screens/training/training.component';


@NgModule({
  declarations: [
    FormStringPipe,
    AppComponent,
    LoginComponent,
    MainComponent,
    ShopComponent,
    HorseComponent,
    RaceComponent,
    TrainingComponent
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

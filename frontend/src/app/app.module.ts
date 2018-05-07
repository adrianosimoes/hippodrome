import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';

import { MainComponent } from './screens/main/main.component';
import { LoginComponent } from './screens/login/login.component';
import { ShopComponent } from './screens/shop/shop.component'; 
import { BuyHorseComponent } from './widget//buy-horse/buy-horse.component';
import { RaceComponent } from './screens/race/race.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ShopComponent,
    BuyHorseComponent,
    RaceComponent
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

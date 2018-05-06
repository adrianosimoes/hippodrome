import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './screens/login/login.component';
import { ShopComponent } from './screens/shop/shop.component'; 
import { BuyHorseComponent } from './widget//buy-horse/buy-horse.component';

import { FormsModule } from '@angular/forms';
import { MainScreenComponent } from './screens/main-screen/main-screen.component';
import { AppRoutingModule } from './/app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainScreenComponent,
    ShopComponent,
    BuyHorseComponent
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

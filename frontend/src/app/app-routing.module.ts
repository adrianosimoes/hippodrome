import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainScreenComponent }      from './screens/main-screen/main-screen.component';
import { LoginComponent }      from './screens/login/login.component';
import { ShopComponent }      from './screens/shop/shop.component';
import { BuyHorseComponent } from './widget/buy-horse/buy-horse.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainScreenComponent },
  { path: 'shop', component: ShopComponent }
];


@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ]
})

export class AppRoutingModule { }


import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent }      from './screens/main/main.component';
import { LoginComponent }      from './screens/login/login.component';
import { ShopComponent }      from './screens/shop/shop.component';
import { RaceComponent } from './screens/race/race.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'race/:id', component: RaceComponent }
];


@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ]
})

export class AppRoutingModule { }


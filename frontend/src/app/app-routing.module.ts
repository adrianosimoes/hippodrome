import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './screens/about/about.component';
import { AuctionComponent } from './screens/auction/auction.component';
import { MainComponent }      from './screens/main/main.component';
import { LoginComponent }      from './screens/login/login.component';
import { ShopComponent }      from './screens/shop/shop.component';
import { RaceComponent } from './screens/race/race.component';
import { TrainingComponent } from './screens/training/training.component';
import { StablesComponent } from './screens/stables/stables.component';
import { LeagueComponent } from './screens/league/league.component';
import { LevelUpComponent } from './screens/levelup/levelup.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'auction', component: AuctionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'stables', component: StablesComponent },
  { path: 'league/:action', component: LeagueComponent },
  { path: 'race/:id', component: RaceComponent },
  { path: 'levelUp', component: LevelUpComponent },
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes, {useHash: false})]
})

export class AppRoutingModule { }


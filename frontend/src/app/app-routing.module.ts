import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent }      from './screens/main/main.component';
import { LoginComponent }      from './screens/login/login.component';
import { ShopComponent }      from './screens/shop/shop.component';
import { RaceComponent } from './screens/race/race.component';
import { TrainingComponent } from './screens/training/training.component';
import { StablesComponent } from './screens/stables/stables.component';
import { PickRaceComponent } from './screens/pick-race/pick-race.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'stables', component: StablesComponent },
  { path: 'pickRace', component: PickRaceComponent },
  { path: 'race/:id', component: RaceComponent },
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes, {useHash: false})]
})

export class AppRoutingModule { }


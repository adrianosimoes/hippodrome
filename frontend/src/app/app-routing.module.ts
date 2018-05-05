import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainScreenComponent }      from './main-screen/main-screen.component';
import { LoginComponent }      from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainScreenComponent }
];


@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})

export class AppRoutingModule { }


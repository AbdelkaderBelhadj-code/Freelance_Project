import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AddEventComponent } from './add-event/add-event.component';
import { EventdetailComponent } from './eventdetail/eventdetail.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardManager } from './guards/AuthGuardManager.guard';
import { AuthGuard } from './guards/auth.guard';
import { ListeventsComponent } from './listevents/listevents.component';
import { ManageinvitationsComponent } from './manageinvitations/manageinvitations.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateproductComponent } from './createproduct/createproduct.component';
import { ProductListComponent } from './productlist/productlist.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  { path: 'events/add', component: AddEventComponent, canActivate: [AuthGuardManager] },
  { path: 'events/:id', component: EventdetailComponent, canActivate: [AuthGuard] },
  { path: 'map', component: MapComponent, canActivate: [AuthGuard] },
  { path: 'events', component: ListeventsComponent, canActivate: [AuthGuard] },
  { path: 'pending', component: ManageinvitationsComponent ,canActivate: [AuthGuardManager]},
  { path: 'profile', component: ProfileComponent ,canActivate: [AuthGuard]},
  { path: 'addproduct', component: CreateproductComponent,canActivate: [AuthGuardManager] },
  { path: 'list', component: ProductListComponent,canActivate: [AuthGuard] },

  // Default redirection
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

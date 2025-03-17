import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AddEventComponent } from './add-event/add-event.component';
import { EventdetailComponent } from './eventdetail/eventdetail.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ListeventsComponent } from './listevents/listevents.component';
import { ManageinvitationsComponent } from './manageinvitations/manageinvitations.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateproductComponent } from './createproduct/createproduct.component';
import { ProductListComponent } from './productlist/productlist.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    EventdetailComponent,
    AddEventComponent,
    SignupComponent,
    LoginComponent,
    ListeventsComponent,
    ManageinvitationsComponent,
    NavbarComponent,
    ProfileComponent,
    CreateproductComponent,
    ProductListComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

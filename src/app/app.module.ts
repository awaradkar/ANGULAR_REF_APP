import { BrowserModule } from '@angular/platform-browser';
import { NgModule, forwardRef } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR }   from '@angular/forms';

import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { AlertComponent } from './alert/alert.component';
import {CommodityComponent} from './menu/commodity/commodity.component'
import { OrganizationComponent } from './menu/organization/organization.component';
import { PacksComponent } from './menu/packs/packs.component';
import { CommodityPacksComponent } from './menu/commodity-packs/commodity-packs.component';
import { WarehouseCommodityMapComponent } from './menu/warehouse-commodity-map/warehouse-commodity-map.component';
import { UserComponent } from './menu/user/user.component';
import { AgGridModule } from 'ag-grid-angular';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';

import { AuthGuard } from './helpers/auth.guard';
import { JwtInterceptor } from './helpers/auth.jwt';

import { AuthenticationService } from './service/authentication.service';
import { AlertService } from './service/alert.service';
import { UserService } from './service/user.service';
import { CommodityService } from './service/commodity.service';
import { MDBBootstrapModule } from 'angular-bootstrap-md'; 
import { AutoCompleteService } from './service/autocomplete.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { OrganizationService } from './service/organization.service';
import { PackService } from './service/pack.service';
import { WarehouseCommService } from './service/whCommMap.servive';
import { ChangePasswdComponent } from './menu/change-passwd/change-passwd.component';

@NgModule({
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    AlertComponent,
    CommodityComponent,
    OrganizationComponent,
    PacksComponent,
    CommodityPacksComponent,
    WarehouseCommodityMapComponent,
    UserComponent,
    ChangePasswdComponent  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
    MatAutocompleteModule, MatInputModule,
    AgGridModule.withComponents([]),
    NgbModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot([
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'menu/commodity', component: CommodityComponent }
    ])
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    CommodityService,
    AutoCompleteService,
    UserService,
    OrganizationService,
    PackService,
    WarehouseCommService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CommodityComponent),
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

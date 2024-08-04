import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Screen1Component } from './screen/screen1/screen1.component';
import { Screen2Component } from './screen/screen2/screen2.component';
import { Screen3Component } from './screen/screen3/screen3.component';

import { VpAccountNoComponent } from './parts/vp-account-no/vp-account-no.component';
import { VpTextComponent } from './parts/vp-text/vp-text.component';

import { FormsModule } from '@angular/forms';
import { BaseTextComponent } from './parts/base/base-text/base-text.component';
import { TableTextComponent } from './parts/middle/table-text/table-text.component';
import { MksInfoComponent } from './parts/top/mks-info/mks-info.component';

export const routes: Routes = [
  {
    path: 'screen1',
    component: Screen1Component,
  },
  {
    path: 'screen2',
    component: Screen2Component,
  },
  {
    path: 'screen3',
    component: Screen3Component,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    VpAccountNoComponent,
    VpTextComponent,
    Screen1Component,
    Screen2Component,
    Screen3Component,
    BaseTextComponent,
    TableTextComponent,
    MksInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

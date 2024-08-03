import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Screen1Component } from './screen/screen1/screen1.component';
import { VpTitleComponent } from './parts/vp-title/vp-title.component';
import { VpAccountNoComponent } from './parts/vp-account-no/vp-account-no.component';
import { VpTextComponent } from './parts/vp-text/vp-text.component';

import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  {
    path: 'screen1',
    component: Screen1Component,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    Screen1Component,
    VpTitleComponent,
    VpAccountNoComponent,
    VpTextComponent
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

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';

import { Screen1Component } from './screen/screen1/screen1.component';
import { Screen2Component } from './screen/screen2/screen2.component';
import { Screen3Component } from './screen/screen3/screen3.component';

// HTTP クライアントのための import ( Angular 5.0.0 以降はこちらを使う )

// // HTTP クライアントとしてのコンポーネント
// import { HttpClientComponent } from './http-client/http-client.component';
// // バックエンドとの通信を実際に担当するサービス
// import { HttpClientService } from './service/http-client.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { BaseTextComponent } from './parts/base/base-text/base-text.component';
import { TableTextComponent } from './parts/middle/table-text/table-text.component';
import { MksInfoComponent } from './parts/top/mks-info/mks-info.component';
import { BaseRadioComponent } from './parts/base/base-radio/base-radio.component';
import { TableRadioComponent } from './parts/middle/table-radio/table-radio.component';
import { BaseAnchorComponent } from './parts/base/base-anchor/base-anchor.component';

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
    Screen1Component,
    Screen2Component,
    Screen3Component,
    BaseTextComponent,
    TableTextComponent,
    MksInfoComponent,
    BaseRadioComponent,
    TableRadioComponent,
    BaseAnchorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

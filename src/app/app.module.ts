import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule }         from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { PageModule }   from '../page/page.module';
import { PageRoutingModule } from '../page/page.routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PageModule,
    PageRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { WeUiModule }           from '../../weui/index';

import { Ng4yComponentsModule } from '../../ng4y-components/ng4y.module';

import { HomeRoutingModule }    from './home.routing.module';

import { HomeComponent }        from './home.component';

@NgModule({
    imports: [
        WeUiModule.forRoot(),
        HomeRoutingModule,
        CommonModule,
        FormsModule,
        Ng4yComponentsModule,
    ],
    declarations: [
        HomeComponent,
    ],
    providers: [

    ]
})

export class HomeModule{

}

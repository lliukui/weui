import { NgModule }             from '@angular/core';
import { WeUiModule }           from 'ngx-weui';

import { HomeRoutingModule }    from './home.routing.module';

import { HomeComponent }        from './home.component';

@NgModule({
    imports: [
        WeUiModule.forRoot(),
        HomeRoutingModule,
    ],
    declarations: [
        HomeComponent,
    ],
    providers: [

    ]
})

export class HomeModule{

}

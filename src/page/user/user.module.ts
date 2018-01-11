import { NgModule }             from '@angular/core';
import { WeUiModule }           from 'ngx-weui';

import { UserRoutingModule }    from './user.routing.module';

import { UserComponent }        from './user.component';

@NgModule({
    imports: [
        WeUiModule.forRoot(),
        UserRoutingModule,
    ],
    declarations: [
        UserComponent,
    ],
    providers: [

    ]
})

export class UserModule{

}

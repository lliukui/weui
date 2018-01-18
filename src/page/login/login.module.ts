import { NgModule }                   from '@angular/core';
import { FormsModule }                from '@angular/forms';
import { WeUiModule }                 from '../../weui/index';

import { LoginService }               from './login.service';
import { LoginRoutingModule }         from './login.routing.module';

import { LoginComponent }             from './login.component';

@NgModule({
    imports: [
        FormsModule,
        WeUiModule.forRoot(),
        LoginRoutingModule,
    ],
    declarations: [
        LoginComponent,
    ],
    providers: [
        LoginService,
    ]
})

export class LoginModule{

}

import { NgModule }                from '@angular/core';
import { RouterModule }            from '@angular/router';

import { AuthGuardRole }           from '../auth-guard-role.service';

import { HomeComponent }           from './home.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: HomeComponent,
            canActivate: [AuthGuardRole],
        }
    ])]
})

export class HomeRoutingModule{

}

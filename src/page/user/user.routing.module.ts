import { NgModule }                from '@angular/core';
import { RouterModule }            from '@angular/router';

import { UserComponent }           from './user.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: UserComponent,
        }
    ])]
})

export class UserRoutingModule{

}

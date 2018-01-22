import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { WorkbenchReceptionComponent }    from './workbench-reception.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'reception',
            //canActivate: [AuthGuardRole],
            component: WorkbenchReceptionComponent,
        }
    ])],
    exports: [RouterModule]
})

export class WorkbenchRoutingModule{

}

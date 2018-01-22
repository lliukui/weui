import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { WeUiModule }           from '../../weui';

import { WorkbenchService }               from './workbench.service';
import { WorkbenchRoutingModule }    from './workbench.routing.module';

import { WorkbenchReceptionComponent }        from './workbench-reception.component';

@NgModule({
    imports: [
        CommonModule,
        WeUiModule.forRoot(),
        WorkbenchRoutingModule,
    ],
    declarations: [
        WorkbenchReceptionComponent,
    ],
    providers: [
        WorkbenchService,
    ]
})

export class WorkbenchModule{

}

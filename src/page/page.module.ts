import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { HttpModule }                     from '@angular/http';

import { AuthGuardRole }                  from './auth-guard-role.service';
import { SelectivePreloadingStrategy }    from './selective-preloading-strategy'

import { PageService }                    from './page.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
    ],
    declarations: [
    ],
    providers: [
        SelectivePreloadingStrategy,
        AuthGuardRole,
        PageService,
    ],
})

export class PageModule{

}

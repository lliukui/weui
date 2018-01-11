import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { HttpModule }                     from '@angular/http';

import { SelectivePreloadingStrategy }    from './selective-preloading-strategy'

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
    ],
    declarations: [
    ],
    providers: [
        SelectivePreloadingStrategy,
    ],
})

export class PageModule{

}

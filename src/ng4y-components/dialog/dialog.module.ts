import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { FormsModule }      from '@angular/forms';

import { Dialog }           from './dialog.component';

@NgModule({
    declarations: [Dialog],
    exports: [Dialog],
    imports: [CommonModule, FormsModule],
})

export class DialogModule{

}

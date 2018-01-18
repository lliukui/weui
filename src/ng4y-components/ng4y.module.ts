import { NgModule }              from '@angular/core';

import { QRCodeModule }          from './ng4y-qrcode.module';
import { DialogModule }          from './dialog/dialog.module';

@NgModule({
    exports: [
        QRCodeModule,
        DialogModule,
    ]
})

export class Ng4yComponentsModule{

}

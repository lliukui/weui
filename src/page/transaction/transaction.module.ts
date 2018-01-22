import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }                       from '@angular/forms';
import { WeUiModule }           from '../../weui';

import { TransactionService }               from './transaction.service';
import { TransactionRoutingModule }    from './transaction.routing.module';

import { TransactionStatisticsComponent }        from './transaction-statistics.component';
import { TransactionStatisticsInfoComponent }        from './transaction-statisticsInfo.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        WeUiModule.forRoot(),
        TransactionRoutingModule,
    ],
    declarations: [
        TransactionStatisticsComponent,
        TransactionStatisticsInfoComponent,
    ],
    providers: [
        TransactionService,
    ]
})

export class TransactionModule{

}

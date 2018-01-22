import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { TransactionStatisticsComponent }    from './transaction-statistics.component';
import { TransactionStatisticsInfoComponent }    from './transaction-statisticsInfo.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'statistics',
            //canActivate: [AuthGuardRole],
            component: TransactionStatisticsComponent,
        },
        {
            path: 'statisticsInfo',
            //canActivate: [AuthGuardRole],
            component: TransactionStatisticsInfoComponent,
        }
    ])],
    exports: [RouterModule]
})

export class TransactionRoutingModule{

}

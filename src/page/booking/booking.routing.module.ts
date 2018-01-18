import { NgModule }                    from '@angular/core';
import { RouterModule }                from '@angular/router';

import { AuthGuardRole }               from '../auth-guard-role.service';

import { BookingComponent }            from './booking.component';
import { BookingInfo }                 from './booking-info.component';
import { BookingPayBookingFee }        from './booking-payBookingFee.component';
import { BookingList }                 from './booking-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: BookingComponent,
            canActivate: [AuthGuardRole],
        },
        {
            path: 'info',
            component: BookingInfo,
        },
        {
            path: 'payBookingFee',
            component: BookingPayBookingFee,
        },
        {
            path: 'list',
            component: BookingList,
        },
    ])]
})

export class BookingRoutingModule{}

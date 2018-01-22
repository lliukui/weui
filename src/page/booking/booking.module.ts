import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';
import { WeUiModule }                        from '../../weui/index';

import { Ng4yComponentsModule }              from '../../ng4y-components/ng4y.module';

import { BookingRoutingModule }              from './booking.routing.module';
import { BookingService }                    from './booking.service';

import { BookingComponent }                  from './booking.component';
import { BookingInfo }                       from './booking-info.component';
import { BookingPayBookingFee }              from './booking-payBookingFee.component';
import { BookingList }                       from './booking-list.component';
import { BookingListWeek }                   from './booking-listWeek.component';

@NgModule({
    imports: [
        WeUiModule.forRoot(),
        CommonModule,
        FormsModule,
        BookingRoutingModule,
        Ng4yComponentsModule,
    ],
    declarations: [
        BookingComponent,
        BookingInfo,
        BookingPayBookingFee,
        BookingList,
        BookingListWeek,
    ],
    providers: [
        BookingService,
    ],
})

export class BookingModule{

}

import { Component }         from '@angular/core';
import { ActivatedRoute }    from '@angular/router';

import { appConfig }            from '../config';

@Component({
    selector: 'booking-payBookingFee',
    templateUrl: './booking-payBookingFee.component.html',
    styleUrls: ['./booking-payBookingFee.component.scss'],
})

export class BookingPayBookingFee{
    bookingId: string;
    payType: string;
    type: string;
    payUrl: string;

    constructor(
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.bookingId = '';
        this.payType = '';
        this.type = '';
        this.route.queryParams.subscribe((params) => {
            this.bookingId = params.id;
            this.payType = params.pay_type;
            this.type = params.type;
        });

        this.payUrl = appConfig.baseHTTP + '/mebapi/paybooking/' + this.bookingId + '?pay_way=' + this.payType + '&type=' + this.type;
    }
}

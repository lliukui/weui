import { Component, ViewChild }         from '@angular/core';
import { Router }                       from '@angular/router';
import { ToastComponent }               from '../../weui/toast';
import { ToptipsService }               from '../../weui/toptips';

import { PageService }                  from '../page.service';

import { appConfig }                       from '../config';

@Component({
    selector: 'page-booking-list',
    templateUrl: './booking-list.component.html',
    styleUrls: ['./booking-list.component.scss'],
})

export class BookingList{
    url: string;
    bookingList: any[];
    @ViewChild('loading') loadingToast: ToastComponent;

    constructor(
        private toptips: ToptipsService,
        private pageService: PageService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.url = '?username=' + localStorage.getItem('username')
             + '&token=' + localStorage.getItem('token')
             + '&clinic_id=' + localStorage.getItem('clinicId');
        this.getData();
    }

    getData() {
		var todayDate = this.pageService.getDayByDate(new Date());
        var urlOptions = this.url + '&bdate_big=' + todayDate;
        this.pageService.searchbooking(urlOptions).then((data) => {
            if(data.status == 'no'){
                (<ToastComponent>this.loadingToast).onHide();
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.bookingList = results.weekbooks;
                (<ToastComponent>this.loadingToast).onHide();
            }
        }).catch(() => {
            (<ToastComponent>this.loadingToast).onHide();
            this.toptips.warn('服务器错误');
        });
    }

    goPay(booking) {
        window.location.href = appConfig.http + '/booking/info?id=' + booking.bookingId;
        // this.router.navigate(['./booking/info'], {queryParams: {id: booking.bookingId}});
    }

    goUrl(_url) {
        this.router.navigate(['./' + _url]);
    }
}

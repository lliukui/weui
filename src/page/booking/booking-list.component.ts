import { Component, ViewChild }         from '@angular/core';
import { Router }                       from '@angular/router';
import { ToastComponent }               from '../../weui/toast';
import { ToptipsService }               from '../../weui/toptips';
import { DialogService, DialogConfig, DialogComponent } from '../../weui/dialog';

import { PageService }                  from '../page.service';

import { appConfig }                    from '../config';

@Component({
    selector: 'page-booking-list',
    templateUrl: './booking-list.component.html',
    styleUrls: ['./booking-list.component.scss'],
})

export class BookingList{
    url: string;
    bookingList: any[];
    hasData: boolean;
    @ViewChild('loading') loadingToast: ToastComponent;
    selectorBooking: {
        bookingId: string,
        remark: string,
    }
    @ViewChild('auto') autoAS: DialogComponent;
    private cancelConfig: DialogConfig = <DialogConfig>{
        title: '取消原因',
        content: '',
        cancel: '辅助操作',
        confirm: '主操作',
        inputPlaceholder: '请输入取消原因',
        inputError: '请输入取消原因',
        inputRequired: true,
        inputAttributes: {
            maxlength: 200,
            cn: 1
        },
    };
    private backFeeConfig: DialogConfig = <DialogConfig>{
        title: '退款金额',
        content: '',
        cancel: '辅助操作',
        confirm: '主操作',
        inputPlaceholder: '请输入退款金额',
        inputError: '请输入退款金额',
        inputRequired: true,
    };
    config: DialogConfig = {};

    constructor(
        private toptips: ToptipsService,
        private pageService: PageService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.bookingList = [];
        this.hasData = false;
        this.selectorBooking = {
            bookingId: '',
            remark: '',
        }
        this.url = '?username=' + localStorage.getItem('username')
             + '&token=' + localStorage.getItem('token')
             + '&clinic_id=' + localStorage.getItem('clinicId');
        this.getData();
    }

    getData() {
        (<ToastComponent>this.loadingToast).onShow();
		var todayDate = this.pageService.getDayByDate(new Date());
        var urlOptions = this.url + '&bdate_big=' + todayDate;
        this.pageService.searchbooking(urlOptions).then((data) => {
            if(data.status == 'no'){
                (<ToastComponent>this.loadingToast).onHide();
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.bookingList = results.weekbooks;
                this.hasData = true;
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

    cancel(booking) {
        const cog = Object.assign({}, this.cancelConfig, <DialogConfig>{
            skin: 'auto',
            type: 'prompt',
            confirm: '确认',
            cancel: '取消',
            input: 'textarea',
            inputValue: undefined,
            inputRegex: null
        });
        this.config = cog;
        this.autoAS.show().subscribe((res: any) => {
            if(res.value){
                (<ToastComponent>this.loadingToast).onShow();
                var urlOptions = booking.bookingId + '?username=' + localStorage.getItem('username')
			         + '&token=' + localStorage.getItem('token') + '&remark=' + res.result;
                this.pageService.bookingcancelled(urlOptions).then((data) => {
                    if(data.status == 'no'){
                        (<ToastComponent>this.loadingToast).onHide();
                        this.toptips.warn(data.errorMsg);
                    }else{
                        (<ToastComponent>this.loadingToast).onHide();
                        this.toptips.success('预约取消成功');
                        this.getData();
                    }
                }).catch((err) => {
                    (<ToastComponent>this.loadingToast).onHide();
                    this.toptips.warn('服务器错误');
                });
            }
        });
        return false;
    }

    backFee(booking) {
        this.backFeeConfig.content = (booking.tranInfo.id ? '已支付全额：' : '已支付预约金：') + this.pageService.toDecimal2(booking.tranInfo.id ? booking.tranInfo.amount : booking.yyj.amount);
        const cog = Object.assign({}, this.backFeeConfig, <DialogConfig>{
            skin: 'auto',
            type: 'prompt',
            confirm: '确认',
            cancel: '取消',
            input: 'number',
            inputValue: undefined,
            inputRegex: null
        });
        this.config = cog;
        this.autoAS.show().subscribe((res: any) => {
            if(res.value){
                if(parseFloat(res.result) <= 0){
                    this.toptips.warn('退款金额应大于0');
                    return;
                }
                if(parseFloat(res.result) > parseFloat(booking.tranInfo.id ? booking.tranInfo.amount : booking.yyj.amount)){
                    this.toptips.warn('退还金额不可大于已付金额');
                    return;
                }
                (<ToastComponent>this.loadingToast).onShow();
                var urlOptions = booking.bookingId + this.url + '&refund_fee=' + res.result;
        		this.pageService.bookingrefund(urlOptions).then((data) => {
        			if(data.status == 'no'){
                        (<ToastComponent>this.loadingToast).onHide();
                        this.toptips.warn(data.errorMsg);
        			}else{
                        (<ToastComponent>this.loadingToast).onHide();
                        this.toptips.success('金额退还成功');
                        this.getData();
        			}
        		}).catch((err) => {
                    (<ToastComponent>this.loadingToast).onHide();
                    this.toptips.warn('服务器错误');
        		});
            }
        });
        return false;
    }
}

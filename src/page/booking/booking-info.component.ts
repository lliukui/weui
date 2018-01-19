import { Component, ViewChild, OnInit }       from '@angular/core';
import { Router, ActivatedRoute }     from '@angular/router';

import { ToptipsService }             from '../../weui/toptips';
import { ActionSheetConfig, ActionSheetComponent } from "../../weui/actionsheet";
import { ToastComponent }             from '../../weui/toast';
import { DialogService, DialogConfig, DialogComponent } from '../../weui/dialog';


import { PageService }                from '../page.service';

@Component({
    selector: 'booking-info',
    templateUrl: './booking-info.component.html'
})

export class BookingInfo implements OnInit{
    url: string;
    bookingId: string;
    bookingInfo: {
        authCode: string,
        bookingDate: string,
        childId: string,
        childName: string,
        doctorId: string,
        doctorName: string,
        mobile: string,
        serviceName: string,
        status: string,
        statusText: string,
    }
    booking: {
        authCode: string,
    }
    showTab: string;
    @ViewChild('loading') loadingToast: ToastComponent;
    @ViewChild('actionSheet') actionSheet: ActionSheetComponent;
    menus: any[] = [
        { text: '预约金', value: 'yyj'},
        { text: '全额', value: 'service' }
    ];
    config: ActionSheetConfig = <ActionSheetConfig>{
        title: '支付类型'
    };
    type: string = '';
    @ViewChild('autoDialog') autoDialog: DialogComponent;
    private typeConfig: DialogConfig = <DialogConfig>{
        title: '选择支付方式',
        inputError: '请选择支付方式',
        inputRequired: true,
        inputOptions: [
            {text: '微信', value: 'wechat'},
            {text: '支付宝', value: 'ali'}
        ]
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private pageService: PageService,
        private toptips: ToptipsService,
    ) {}

    ngOnInit() {
        this.bookingId = '';
        this.route.queryParams.subscribe((params) => {
            this.bookingId = params.id;
        });

        this.bookingInfo = {
            authCode: '',
            bookingDate: '',
            childId: '',
            childName: '',
            doctorId: '',
            doctorName: '',
            mobile: '',
            serviceName: '',
            status: '',
            statusText: '',
        };
        this.booking = {
            authCode: '',
        };
        this.showTab = '';

        (<ToastComponent>this.loadingToast).onShow();
        this.pageService.bookinginfo(this.bookingId).then((data) => {
            if(data.status == 'no'){
                (<ToastComponent>this.loadingToast).onHide();
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.bookingInfo = results.bookinginfo;
                (<ToastComponent>this.loadingToast).onHide();
            }
        }).catch(() => {
            (<ToastComponent>this.loadingToast).onHide();
            this.toptips.warn('服务器错误');
        });
    }

    showBookingInfo() {
        if(this.booking.authCode == this.bookingInfo.authCode){
            this.showTab = 'info';
        }else{
            this.toptips.warn('鉴权码不正确');
        }
    }

    pay() {
        this.config.skin = 'ios';
        this.config = Object.assign({}, this.config);
        setTimeout(() => {
            (<ActionSheetComponent>this.actionSheet).show().subscribe((res: any) => {
                this.type = res.value;
                this.selectType();
            });
        }, 10);
    }

    selectType() {
        const cog = Object.assign({}, this.typeConfig, <DialogConfig>{
            skin: 'auto',
            type: 'prompt',
            confirm: '确认',
            cancel: '取消',
            input: 'radio',
            inputValue: undefined,
            inputRegex: null
        });
        this.config = cog;
        this.autoDialog.show().subscribe((res: any) => {
            if (res.result){
                this.router.navigate(['./booking/payBookingFee'], {queryParams: {id: this.bookingId, pay_type: res.result.value, type: this.type}});
            }
        });
        return false;
    }
}

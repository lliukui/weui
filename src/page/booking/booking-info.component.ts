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
        age: string,
        authCode: string,
        bookingDate: string,
        childId: string,
        childName: string,
        creatorId: string,
        creatorName: string,
        mobile: string,
        refereeName: string,
        remark: string,
        services: any[],
        status: string,
        statusText: string,
        time: string,
    }
    booking: {
        mobile: string,
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
    payType: string = '';
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

        this.url = '?username=' + sessionStorage.getItem('username')
             + '&token=' + sessionStorage.getItem('token')
             + '&clinic_id=' + sessionStorage.getItem('clinicId');

        this.bookingInfo = {
            age: '',
            authCode: '',
            bookingDate: '',
            childId: '',
            childName: '',
            creatorId: '',
            creatorName: '',
            mobile: '',
            refereeName: '',
            remark: '',
            services: [],
            status: '',
            statusText: '',
            time: '',
        };
        this.booking = {
            mobile: '',
            authCode: '',
        };
        this.showTab = 'info';

        (<ToastComponent>this.loadingToast).onShow();
        var urlOptions = this.url + '&id=' + this.bookingId;
        this.pageService.searchbooking(urlOptions).then((data) => {
            if(data.status == 'no'){
                (<ToastComponent>this.loadingToast).onHide();
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.weekbooks.length > 0){
                    this.bookingInfo = results.weekbooks[0];
                };
                (<ToastComponent>this.loadingToast).onHide();
            }
        }).catch(() => {
            (<ToastComponent>this.loadingToast).onHide();
            this.toptips.warn('服务器错误');
        });
    }

    showBookingInfo() {
        if((this.booking.mobile == this.bookingInfo.mobile) && this.booking.authCode == (this.bookingInfo.authCode)){
            this.showTab = 'info';
        }else{
            this.toptips.warn('手机号码或邀请码不正确');
        }
    }

    pay() {
        this.config.skin = 'ios';
        this.config = Object.assign({}, this.config);
        setTimeout(() => {
            (<ActionSheetComponent>this.actionSheet).show().subscribe((res: any) => {
                this.payType = res.value;
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
                this.router.navigate(['./booking/payBookingFee'], {queryParams: {id: this.bookingId, pay_type: this.payType, type: res.result.value}});
            }
        });
        return false;
    }
}

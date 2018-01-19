import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { SkinType, InputType } from '../../weui/index';
import { DialogService, DialogConfig, DialogComponent } from '../../weui/dialog';
import { ToptipsService }                  from '../../weui/toptips';
import { ToastService }                    from '../../weui/toast';
import { PickerData, PickerOptions, PickerService } from '../../weui/picker';

import { PageService }        from '../page.service';


import { appConfig }                       from '../config';

@Component({
    selector: 'booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss'],
})

export class BookingComponent{
    @ViewChild('auto') autoAS: DialogComponent;

    booking: {
        id: string,
        childType: string,
        child: {
            label: string, value: string,
        }
        child_info: {
            name: string,
            gender: {
                label: string, value: string,
            },
            birth_date: string,
        }
        user: {
            id: string, name: string, mobile: string,
        }
        referee: {
            text: string, value: string
        },
        service: {
            text: string, value: string
        },
        doctor: {
            text: string, value: string,
        },
        booking_fee: string,
        booking_date: {
            text: string, value: string,
        },
        time: {
            text: string, value: string,
        },
        remark: string,
        authCode: string,
    }
    loading: boolean = false;
    childList: any[];
    genderList: any[];
    serviceList: any[];
    items: string[] = Array(6).fill('').map((v: string, idx: number) => `Item${idx}`);
    private refereeConfig: DialogConfig = <DialogConfig>{
        title: '选择推荐人',
        inputError: '请选择推荐人',
        inputRequired: true,
        inputOptions: []
    };
    private doctorConfig: DialogConfig = <DialogConfig>{
        title: '选择医生',
        inputError: '请选择医生',
        inputRequired: true,
        inputOptions: []
    };
    private bookingDateConfig: DialogConfig = <DialogConfig>{
        title: '选择日期',
        inputError: '请选择日期',
        inputRequired: true,
        inputOptions: []
    };
    private timeConfig: DialogConfig = <DialogConfig>{
        title: '选择时间',
        inputError: '请选择时间',
        inputRequired: true,
        inputOptions: []
    };
    private authCodeConfig: DialogConfig = <DialogConfig>{
        title: '邀请码',
        content: '',
        confirm: '确定',
    };
    config: DialogConfig = {};
    url: string;

    constructor(
        private srv: DialogService,
        private pageService: PageService,
        private toptips: ToptipsService,
        private toast: ToastService,
        private router: Router,
        private picker: PickerService,
    ) {}

    ngOnInit() {
        this.booking = {
            id: '',
            childType: 'has',
            child: {
                label: '', value: ''
            },
            child_info: {
                name: '',
                gender: {
                    label: '', value: ''
                },
                birth_date: '',
            },
            user: {
                id: '', name: '', mobile: '',
            },
            referee: {
                text: '', value: ''
            },
            service: {
                text: '', value: ''
            },
            doctor: {
                text: '', value: ''
            },
            booking_fee: '',
            booking_date: {
                text: '', value: ''
            },
            time: {
                text: '', value: ''
            },
            remark: '',
            authCode: '',
        }
        this.childList = [];
        this.genderList = [
            [
                {label: '男', value: 'M'},
                {label: '女', value: 'F'},
            ]
        ];
        this.serviceList = [];

        this.url = '?username=' + localStorage.getItem('username')
             + '&token=' + localStorage.getItem('token')
             + '&clinic_id=' + localStorage.getItem('clinicId');

        // 获取宝宝列表
        this.pageService.searchchild(this.url).then((data) => {
            if(data.status == 'no'){
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                var child_list = [];
                for(var item of results.child){
                    var child = {
                        label: item.childName,
                        value: JSON.stringify({
                            id: item.childId,
                            name: item.childName,
                        })
                    }
                    child_list.push(child);
                }
                this.childList.push(child_list);
            }
        }).catch(() => {
            this.toptips.warn('服务器错误');
        });

        // 获取推荐人列表
        this.pageService.adminlist(this.url).then((data) => {
            if(data.status == 'no'){
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.refereeConfig.inputOptions = [];
                for(var item of results.adminlist){
                    var referee = {
                        text: item.realName,
                        value: JSON.stringify({
                            id: item.id,
                            name: item.realName,
                        })
                    }
                    this.refereeConfig.inputOptions.push(referee);
                }
            }
        }).catch(() => {
            this.toptips.warn('服务器错误');
        });

        // 获取科室列表
        this.pageService.servicelist(this.url).then((data) => {
            if(data.status == 'no'){
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                var service_list = [];
                for(var item of results.servicelist){
                    var service = {
                        label: item.serviceName,
                        value: JSON.stringify({
                            id: item.serviceId,
                            name: item.serviceName,
                        })
                    }
                    service_list.push(service);
                }
                this.serviceList.push(service_list);
            }
        }).catch(() => {
            this.toptips.warn('服务器错误');
        });
    }

    selectChildType(type) {
        this.booking.childType = type;
        this.booking.child = {
            label: '', value: ''
        };
        this.booking.child_info = {
            name: '',
            gender: {
                label: '', value: ''
            },
            birth_date: '',
        };
        this.booking.user = {
            id: '', name: '', mobile: '',
        };
    }

    selectChild() {
        var selectedIndex = 0;
        for(var i = 0; i < this.childList.length; i++){
            for(var j = 0; j < this.childList[i].length; j++){
                if(this.childList[i][j] == this.booking.child){
                    selectedIndex = j;
                }
            }
        }
        this.picker.show(this.childList, null, [selectedIndex], {
            cancel: '取消',
            confirm: '确认'
        }).subscribe((res: any) => {
            this.booking.child = res.items[0];
            // 获取家长信息
            this.getUser();
        });
    }

    selectGender() {
        var selectedIndex = 0;
        for(var i = 0; i < this.genderList.length; i++){
            for(var j = 0; j < this.genderList[i].length; j++){
                if(this.genderList[i][j] == this.booking.child_info.gender){
                    selectedIndex = j;
                }
            }
        }
        this.picker.show(this.genderList, null, [selectedIndex], {
            cancel: '取消',
            confirm: '确认'
        }).subscribe((res: any) => {
            this.booking.child_info.gender = res.items[0];
        });
    }

    selectBirthDate() {
        this.picker.showDateTime('date').subscribe((res: any) => {
            this.booking.child_info.birth_date = res.formatValue;
        });
    }

    getUser() {
        var urlOptions = this.url + '&child_id=' + JSON.parse(this.booking.child.value).id;
        this.pageService.searchuser(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.users.length > 0){
                    this.booking.user = {
                        id: results.users[0].id,
                        name: results.users[0].name,
                        mobile: results.users[0].mobile,
                    }
                }
            }
        }).catch(() => {
            this.toptips.warn('服务器错误');
        });
    }

    selectReferee() {
        const cog = Object.assign({}, this.refereeConfig, <DialogConfig>{
            skin: 'auto',
            type: 'prompt',
            confirm: '确认',
            cancel: '取消',
            input: 'radio',
            inputValue: undefined,
            inputRegex: null
        });
        if(this.booking.referee.text != ''){
            cog.inputValue = this.booking.referee;
        }
        this.config = cog;
        this.autoAS.show().subscribe((res: any) => {
            if (res.result){
                this.booking.referee = res.result;
            }
        });
        return false;
    }

    selectService() {
        var selectedIndex = 0;
        for(var i = 0; i < this.serviceList.length; i++){
            for(var j = 0; j < this.serviceList[i].length; j++){
                if(this.serviceList[i][j] == this.booking.service){
                    selectedIndex = j;
                }
            }
        }
        this.picker.show(this.serviceList, null, [selectedIndex], {
            cancel: '取消',
            confirm: '确认'
        }).subscribe((res: any) => {
            this.booking.service = res.items[0];
            this.getDoctorList();
            // 清空信息
            this.booking.doctor = {
                text: '', value: ''
            };
            this.booking.booking_fee = '';
            this.booking.booking_date = {
                text: '', value: ''
            };
            this.booking.time = {
                text: '', value: ''
            };
        });
    }

    getDoctorList() {
        this.toast.loading('加载中', 100000);
        var urlOptions = this.url + '&service_id=' + JSON.parse(this.booking.service.value).id;
        this.pageService.searchdoctorservice(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.toast.hide();
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.doctorConfig.inputOptions = [];
                for(var item of results.doctors){
                    var doctor = {
                        text: item.doctorName,
                        value: JSON.stringify({
                            id: item.doctorId,
                            name: item.doctorName,
                            bookingFee: item.bookingFee,
                            doctorDutys: item.doctorDutys,
                        })
                    }
                    this.doctorConfig.inputOptions.push(doctor);
                }
                this.toast.hide();
            }
        }).catch(() => {
            this.toast.hide();
            this.toptips.warn('服务器错误');
        });
    }

    selectDoctor() {
        if(this.booking.service.value == ''){
            this.toptips.warn('请先选择科室');
            return;
        }
        if(this.doctorConfig.inputOptions.length == 0){
            this.toptips.warn('该科室下暂无医生');
            return;
        }
        const cog = Object.assign({}, this.doctorConfig, <DialogConfig>{
            skin: 'auto',
            type: 'prompt',
            confirm: '确认',
            cancel: '取消',
            input: 'radio',
            inputValue: undefined,
            inputRegex: null
        });
        if(this.booking.doctor.text != ''){
            cog.inputValue = this.booking.doctor;
        }
        this.config = cog;
        this.autoAS.show().subscribe((res: any) => {
            if (res.result){
                this.booking.doctor = res.result;
                this.booking.booking_fee = JSON.parse(this.booking.doctor.value).bookingFee;
                // 清空信息
                this.booking.booking_date = {
                    text: '', value: ''
                };
                this.booking.time = {
                    text: '', value: ''
                };
                // 构造日期列表
                var doctorDutys = JSON.parse(this.booking.doctor.value).doctorDutys;
                this.bookingDateConfig.inputOptions = [];
                for(var item of doctorDutys){
                    var date = {
                        text: item.dutyDate + ' ' + item.weekDay,
                        value: JSON.stringify(item),
                    }
                    this.bookingDateConfig.inputOptions.push(date);
                }
            }
        });
        return false;
    }

    selectBookingDate() {
        if(this.booking.doctor.value == ''){
            this.toptips.warn('请先选择医生');
            return;
        }
        if(this.bookingDateConfig.inputOptions.length == 0){
            this.toptips.warn('该医生尚未排班');
            return false;
        }
        const cog = Object.assign({}, this.bookingDateConfig, <DialogConfig>{
            skin: 'auto',
            type: 'prompt',
            confirm: '确认',
            cancel: '取消',
            input: 'radio',
            inputValue: undefined,
            inputRegex: null
        });
        if(this.booking.booking_date.text != ''){
            cog.inputValue = this.booking.booking_date;
        }
        this.config = cog;
        this.autoAS.show().subscribe((res: any) => {
            if (res.result){
                this.booking.booking_date = res.result;
                // 清空信息
                this.booking.time = {
                    text: '', value: ''
                };
                // 构造时间列表
                var date = JSON.parse(this.booking.booking_date.value);
                var list = [];
        		var todayTimeNum = Number((new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()) + '' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()));

        		var timelist = [];
        		// 查询可预约日期
        		if(date.timeList.length > 0){
        			for(var i = 0; i < date.timeList.length; i++){
        				var item = {
        					key: i,
        					type: 'can',
        					value: date.timeList[i],
        				}
        				timelist.push(item);
        			}
        		}

        		for(var i = 0; i < timelist.length; i++){
        			// 判断时间段是否已经被预约
        			if(date.selectedList.length > 0){
        				for(var j = 0; j < date.selectedList.length; j++){
        					if(timelist[i].value == date.selectedList[j]){
        						timelist[i].type = 'already';
        					}
        				}
        			}
        			//如果是当天日期，判断时间是否已经过去
        			if(this.pageService.getDayByDate(new Date) == date.dutyDate){
        				var timeNum = Number(timelist[i].value.replace(':', ''));
        				if(timeNum < todayTimeNum){
        					timelist[i].type = 'overdue';
        				}
        			}
        		}

                this.timeConfig.inputOptions = [];
                for(item of timelist){
                    if(item.type == 'can'){
                        this.timeConfig.inputOptions.push({
                            text: item.value,
                            value: item.value
                        });
                    }
                }
            }
        });
        return false;
    }

    selectTime() {
        if(this.booking.booking_date.value == ''){
            this.toptips.warn('请先选择日期');
            return;
        }

        if(this.timeConfig.inputOptions.length == 0){
            this.toptips.warn('该日期时间已满');
            return false;
        }
        const cog = Object.assign({}, this.timeConfig, <DialogConfig>{
            skin: 'auto',
            type: 'prompt',
            confirm: '确认',
            cancel: '取消',
            input: 'radio',
            inputValue: undefined,
            inputRegex: null
        });
        if(this.booking.time.text != ''){
            cog.inputValue = this.booking.time;
        }
        this.config = cog;
        this.autoAS.show().subscribe((res: any) => {
            if (res.result){
                this.booking.time = res.result;
            }
        });
        return false;
    }

    bookingSub() {
        this.loading = true;
        if(parseFloat(this.booking.booking_fee) < 0){
            this.toptips.warn('预约金不可小于0');
            return;
        }
        var params = {
            username: localStorage.getItem('username'),
            token: localStorage.getItem('token'),
            clinic_id: localStorage.getItem('clinicId'),
            type: 'ZJ',
            booking_date: JSON.parse(this.booking.booking_date.value).dutyDate,
            time: this.booking.time.value,
            service_id: JSON.parse(this.booking.service.value).id,
            child_id: this.booking.childType == 'has' ? JSON.parse(this.booking.child.value).id : '',
            child_name: this.booking.childType == 'has' ? JSON.parse(this.booking.child.value).name : this.booking.child_info.name,
            gender: this.booking.childType == 'has' ? null : this.booking.child_info.gender.value,
            birth_date: this.booking.childType == 'has' ? null : this.booking.child_info.birth_date,
            mobile: this.booking.user.mobile,
            user_doctor_id: JSON.parse(this.booking.doctor.value).id,
            creator_id: this.booking.user.id,
            creator_name: this.booking.user.name,
            booking_fee: this.booking.booking_fee,
            referee_id: this.booking.referee.text == '' ? null : JSON.parse(this.booking.referee.value).id,
            referee_name: this.booking.referee.text == '' ? null : JSON.parse(this.booking.referee.value).name,
            remark: this.booking.remark,
        }
        this.pageService.bookingcreate(params).then((data) => {
            if(data.status == 'no'){
                this.loading = false;
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.booking.id = results.bookingId;
                this.booking.authCode = results.authCode;
                this.loading = false;
                this.showCode();
            }
        }).catch(() => {
            this.loading = false;
            this.toptips.warn('服务器错误');
        });
    }

    showCode() {
        this.config = Object.assign({}, this.authCodeConfig, <DialogConfig>{
            skin: 'auto',
            cancel: null,
            confirm: null,
            btns: null,
            content: this.booking.authCode
        });
        this.config.confirm = '确定';
        setTimeout(() => {
            (<DialogComponent>this.autoAS).show().subscribe((res: any) => {
                window.location.href = appConfig.http + '/booking/info?id=' + this.booking.id;
                // this.router.navigate(['./booking/info'], {queryParams: {id: this.booking.id}});
            });
        }, 10);
        return false;
    }

    goUrl(_url) {
        this.router.navigate(['./' + _url]);
    }
}

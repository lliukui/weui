import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { SkinType, InputType } from '../../weui/index';
import { DialogService, DialogConfig, DialogComponent } from '../../weui/dialog';
import { ToptipsService }                  from '../../weui/toptips';
import { ToastService }                    from '../../weui/toast';
import { PickerData, PickerOptions, PickerService } from '../../weui/picker';

import { PageService }        from '../page.service';

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
            text: string, value: string,
        }
        child_info: {
            name: string,
            gender: {
                text: string, value: string,
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
    private childConfig: DialogConfig = <DialogConfig>{
        title: '选择宝宝',
        inputError: '请选择宝宝',
        inputRequired: true,
        inputOptions: []
    };
    private genderConfig: DialogConfig = <DialogConfig>{
        title: '选择性别',
        inputError: '请选择性别',
        inputRequired: true,
        inputOptions: [
            {text: '男', value: 'M'},
            {text: '女', value: 'F'},
        ]
    };
    private refereeConfig: DialogConfig = <DialogConfig>{
        title: '选择推荐人',
        inputError: '请选择推荐人',
        inputRequired: true,
        inputOptions: []
    };
    private serviceConfig: DialogConfig = <DialogConfig>{
        title: '选择科室',
        inputError: '请选择科室',
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
                text: '', value: ''
            },
            child_info: {
                name: '',
                gender: {
                    text: '', value: ''
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

        this.url = '?username=' + sessionStorage.getItem('username')
             + '&token=' + sessionStorage.getItem('token')
             + '&clinic_id=' + sessionStorage.getItem('clinicId');

        // 获取宝宝列表
        this.pageService.searchchild(this.url).then((data) => {
            if(data.status == 'no'){
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                for(var item of results.child){
                    var child = {
                        text: item.childName,
                        value: JSON.stringify({
                            id: item.childId,
                            name: item.childName,
                        })
                    }
                    this.childConfig.inputOptions.push(child);
                }
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
                this.serviceConfig.inputOptions = [];
                for(var item of results.servicelist){
                    var service = {
                        text: item.serviceName,
                        value: JSON.stringify({
                            id: item.serviceId,
                            name: item.serviceName,
                        })
                    }
                    this.serviceConfig.inputOptions.push(service);
                }
            }
        }).catch(() => {
            this.toptips.warn('服务器错误');
        });
    }

    selectChildType(type) {
        this.booking.childType = type;
    }

    selectGender() {
        const cog = Object.assign({}, this.genderConfig, <DialogConfig>{
            skin: 'auto',
            type: 'prompt',
            confirm: '确认',
            cancel: '取消',
            input: 'radio',
            inputValue: undefined,
            inputRegex: null
        });
        if(this.booking.child_info.gender.text != ''){
            cog.inputValue = this.booking.child_info.gender;
        }
        this.config = cog;
        this.autoAS.show().subscribe((res: any) => {
            if (res.result){
                this.booking.child_info.gender = res.result;
            }
        });
        return false;
    }

    selectChild() {
        const cog = Object.assign({}, this.childConfig, <DialogConfig>{
            skin: 'auto',
            type: 'prompt',
            confirm: '确认',
            cancel: '取消',
            input: 'radio',
            inputValue: undefined,
            inputRegex: null
        });
        if(this.booking.child.text != ''){
            cog.inputValue = this.booking.child;
        }
        this.config = cog;
        this.autoAS.show().subscribe((res: any) => {
            if (res.result){
                this.booking.child = res.result;
                // 获取家长信息
                this.getUser();
            }
        });
        return false;
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
        const cog = Object.assign({}, this.serviceConfig, <DialogConfig>{
            skin: 'auto',
            type: 'prompt',
            confirm: '确认',
            cancel: '取消',
            input: 'radio',
            inputValue: undefined,
            inputRegex: null
        });
        if(this.booking.service.text != ''){
            cog.inputValue = this.booking.service;
        }
        this.config = cog;
        this.autoAS.show().subscribe((res: any) => {
            if (res.result){
                this.booking.service = res.result;
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
            }
        });
        return false;
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
            username: sessionStorage.getItem('username'),
            token: sessionStorage.getItem('token'),
            clinic_id: sessionStorage.getItem('clinicId'),
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
                this.router.navigate(['./booking/info'], {queryParams: {id: this.booking.id}});
            });
        }, 10);
        return false;
    }
}

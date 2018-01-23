import { Component, OnInit, ViewChild}           from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';
import { ToptipsService }              from '../../weui/toptips';
import { ToastService }                from '../../weui/toast';

import { WorkbenchService }            from './workbench.service';
import { PageService }                 from '../page.service';

@Component({
	selector: 'app-scheduling',
	templateUrl: './workbench-reception.component.html',
	styleUrls: ['./workbench-reception.component.scss'],
	// animations: [slideInDownAnimation],
})
export class WorkbenchReceptionComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	loadingShow: boolean;
	weektitle: any[];
	schedulinglist: any[];
	weekNumConfig: number;
	url: string;
	hasDoctorBookingData: boolean;
	doctorBookingList: any[];
	weekBookingTitle: any[];
	modalTab: boolean;
	showBookinglist: any[];
	searchInfo: {
		doctor: string,
		service: string,
	}
	doctorList: any[];
	serviceList: any[];
	doctorDutyList: any[];
	selected: {
		doctor: string,
		tab: string,
		type: string,
	}
	modalConfirmTab: boolean;
	modalConfirm: {
		text: string,
	}
	hasDutyData: boolean;
	@ViewChild('swiperTitle') swiperTitle: any;
	@ViewChild('swiper') swiperDDD: any;
	swiperDom: any = {
		loop: false,
		on:{
	    	slideChange: (swiper: any) => {
				if(this.swiperTitle && this.swiperTitle.swiper){
					this.swiperTitle.swiper.slideTo(this.swiperDDD.swiper.activeIndex,100,false);
				}
	    	},
	  	},
    };
	swiperTitleDom: any = {
		loop: false,
		on:{
	    	slideChange: (swiper: any) => {
				if(this.swiperDDD && this.swiperDDD.swiper){
					this.swiperDDD.swiper.slideTo(this.swiperTitle.swiper.activeIndex,100,false);
				}
	    	},
	  	},
    };

	constructor(
		private workbenchService: WorkbenchService,
		private pageService: PageService,
		private router: Router,
		private toast: ToastService,
		private toptips: ToptipsService,
	) {}

	ngOnInit(): void{
		this.loadingShow = true;
		this.schedulinglist = [];

		this.hasDoctorBookingData = false;
		this.doctorBookingList = [];
		this.modalTab = false;
		this.showBookinglist = [];

		this.weekNumConfig = 0;
		this.url = '?username=' + localStorage.getItem('username')
				 + '&token=' + localStorage.getItem('token')
				 + '&clinic_id=' + localStorage.getItem('clinicId');

		 //获取医生列表
 	 	this.doctorList = [];
 	 	var adminlistUrl = this.url + '&role=2';
 	 	this.workbenchService.adminlist(adminlistUrl).then((data) => {
 			if(data.status == 'no'){
 		        this.toptips.warn(data.errorMsg);
 			}else{
 				var results = JSON.parse(JSON.stringify(data.results));
 				if(results.adminlist.length > 0){
 					for(var i = 0; i < results.adminlist.length; i++){
 						results.adminlist[i].string = JSON.stringify(results.adminlist[i]);
 					}
 				}
 				this.doctorList = results.adminlist;
 			}
 		}).catch((err) => {
			this.toptips.warn('服务器错误');
 		});

		this.search();
	}

	search() {
		var dutyUrl = this.url + '&weekindex=' + this.weekNumConfig;
		var bookingUrl = this.url + '&weekindex=' + this.weekNumConfig;
		this.getList(dutyUrl);
		//this.getBookingList(bookingUrl);
	}

	prec() {
		this.weekNumConfig--;
		this.search();
	}

	now() {
		this.weekNumConfig = 0;
		this.search();
	}

	next() {
		this.weekNumConfig++;
		this.search();
	}

	getList(urlOptions) {
		this.schedulinglist = [];
		this.workbenchService.adminduty(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
		        this.toptips.warn(data.errorMsg);
			}else{
				var adminduty = JSON.parse(JSON.stringify(data.results)).adminduty;
				if(adminduty.length > 0){
					var weekArray = this.pageService.getWeekByNumber(this.weekNumConfig);
					var weektitle = [];
					var week = [];
					var array = [];
					//先遍历时间
					for(var i = 0; i < weekArray.length; i++){
						var obj ={date : '',dateFormat:'',title:''};
						obj.date = weekArray[i];
						obj.dateFormat = this.pageService.dateFormat(weekArray[i]);
						obj.title =this.pageService.getWeekTitle(i);
						week.push(obj);
					}
					for(var i = 0; i < week.length; i++){
						week[i].weekScheduling = [];
						for(var j = 0; j < adminduty.length; j++){
							var scheduling = {
								dutyConfigList: [],
								dutyDay: this.pageService.dateFormat(weekArray[i]),
								dutyId: '',
								dutyName: ''
							}
							if(adminduty[j].DutyList.length > 0){
								for(var k = 0; k < adminduty[j].DutyList.length; k++){
									if(weekArray[i] == adminduty[j].DutyList[k].dutyDay){
										scheduling = adminduty[j].DutyList[k];
										scheduling.dutyConfigList = adminduty[j].DutyList[k].dutyConfig.split(' / ');
									}
								}
							}
							week[i].weekScheduling.push(scheduling);
						}
					}

					// for(var i = 0; i < weekArray.length; i++){
					// 	weekArray[i].weekScheduling = [];
					// 	for(var j = 0; j < adminduty.length; j++){
					// 		var scheduling = {
					// 			date: this.workbenchService.dateFormat(weekArray[j]),
					// 			title: this.workbenchService.getWeekTitle(j),
					// 			dutyConfigList: [],
					// 			dutyDay: this.workbenchService.dateFormat(weekArray[j]),
					// 			dutyId: '',
					// 			dutyName: ''
					// 		}
					// 		if(adminduty[j].DutyList.length > 0){
					// 			for(var k = 0; k < adminduty[j].DutyList.length; k++){
					// 				if(weekArray[i] == adminduty[j].DutyList[k].dutyDay){
					// 					scheduling = adminduty[j].DutyList[k];
					// 					scheduling.dutyConfigList = adminduty[j].DutyList[k].dutyConfig.split(' / ');
					// 				}
					// 			}
					// 		}
					// 		weekArray[i].weekScheduling.push(scheduling);
					// 	}
					// }
				}
				this.weektitle = weektitle;
				this.schedulinglist = week;
				this.loadingShow = false;
			}
		}).catch((err) => {
			this.toptips.warn('服务器错误');
		});
	}

	goUrl(_url) {
        this.router.navigate(['./' + _url]);
    }
	// getBookingList(urlOptions) {
	// 	this.workbenchService.doctorbooking(urlOptions).then((data) => {
	// 		if(data.status == 'no'){
	// 			this.toptips.warn(data.errorMsg);
	// 		}else{
	// 			var results = JSON.parse(JSON.stringify(data.results));
	// 			var weekBookingTitle = [];
	// 			var doctorBookingList = [];
	// 			// 当天日期
	// 			var todayTime = new Date().getTime();
	// 			if(results.list.length > 0){
	// 				var weekArray = this.workbenchService.getWeekByNumber(this.weekNumConfig);
	// 				for(var i = 0; i < results.list.length; i++){
	// 					var doctorBooking = {
	// 						doctorId: results.list[i].doctorId,
	// 						doctorName: results.list[i].doctorName,
	// 						avatarUrl: results.list[i].avatarUrl,
	// 						bookingWeekList: [],
	// 					}
	// 					for(var j = 0; j < weekArray.length; j++){
	// 						var title = {
	// 							date: this.workbenchService.dateFormat(weekArray[j]),
	// 							title: this.workbenchService.getWeekTitle(j)
	// 						}
	// 						var dayBooking = {
	// 							date: this.workbenchService.dateFormat(weekArray[j]),
	// 							bookingList: [],
	// 							num: '',
	// 							string: '',
	// 							use: false,
	// 						}
	// 						// 日期是否过期
	// 						if(todayTime - (24 * 60 * 60 * 1000) < (new Date(this.workbenchService.dateFormatHasWord(dayBooking.date)).getTime())){
	// 							dayBooking.use = true;
	// 						}
	// 						if(results.list[i].serviceList.length > 0){
	// 							for(var k = 0; k < results.list[i].serviceList.length; k++){
	// 								//判断今天是否有预约
	// 								if(weekArray[j] == results.list[i].serviceList[k].bookingDate){
	// 									dayBooking.bookingList.push(results.list[i].serviceList[k]);
	// 								}
	// 							}
	// 						}
	// 						dayBooking.num = dayBooking.bookingList.length.toString();
	// 						dayBooking.string = JSON.stringify(dayBooking.bookingList);
	// 						doctorBooking.bookingWeekList.push(dayBooking);
	// 						if(i == 0){
	// 							weekBookingTitle.push(title);
	// 						}
	// 					}
	// 					doctorBookingList.push(doctorBooking);
	// 				}
	// 			}
	// 			this.hasDoctorBookingData = true;
	// 			this.weekBookingTitle = weekBookingTitle;
	// 			this.doctorBookingList = doctorBookingList;
	// 		}
	// 	}).catch((err) => {
	// 		this.toptips.warn('服务器错误');
	// 	});
	// }


	// 	this.searchInfo = {
	// 		doctor: '',
	// 		service: '',
	// 	}

	//
	// 	//获取科室列表
	// 	this.serviceList = [];
	// 	this.workbenchService.servicelist(this.url).then((data) => {
	// 		if(data.status == 'no'){
	// 	        const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
	// 	        this.toastService.toast(toastCfg);
	// 		}else{
	// 			var results = JSON.parse(JSON.stringify(data.results));
	// 			if(results.servicelist.length > 0){
	// 				for(var i = 0; i < results.servicelist.length; i++){
	// 					results.servicelist[i].string = JSON.stringify(results.servicelist[i]);
	// 				}
	// 			}
	// 			this.serviceList = results.servicelist;
	// 		}
	// 	}).catch((err) => {
	// 		const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
	// 		this.toastService.toast(toastCfg);
	// 	});
	//
	// 	this.doctorDutyList = [];
	// 	this.selected = {
	// 		doctor: '',
	// 		tab: '1',
	// 		type: '',
	// 	};
	// 	this.modalConfirmTab = false;
	// 	this.modalConfirm = {
	// 		text: '',
	// 	}
	//
	// 	this.search();
	// 	this.hasDutyData = false;
	// }
	//
	// search() {
	// 	var dutyUrl = this.url + '&weekindex=' + this.weekNumConfig;
	// 	var bookingUrl = this.url + '&weekindex=' + this.weekNumConfig;
	// 	if(this.searchInfo.doctor != ''){
	// 		dutyUrl += '&doctor_id=' + JSON.parse(this.searchInfo.doctor).id;
	// 		bookingUrl += '&doctorId=' + JSON.parse(this.searchInfo.doctor).id;
	// 	}
	// 	if(this.searchInfo.service != ''){
	// 		bookingUrl += '&service_id=' + JSON.parse(this.searchInfo.service).serviceId;
	// 	}
	// 	this.getList(dutyUrl);
	// 	this.getBookingList(bookingUrl);
	// }
	//

	//
	// getBookingList(urlOptions) {
	// 	this.workbenchService.doctorbooking(urlOptions).then((data) => {
	// 		if(data.status == 'no'){
	// 	        const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
	// 	        this.toastService.toast(toastCfg);
	// 		}else{
	// 			var results = JSON.parse(JSON.stringify(data.results));
	// 			var weekBookingTitle = [];
	// 			var doctorBookingList = [];
	// 			// 当天日期
	// 			var todayTime = new Date().getTime();
	// 			if(results.list.length > 0){
	// 				var weekArray = this.workbenchService.getWeekByNumber(this.weekNumConfig);
	// 				for(var i = 0; i < results.list.length; i++){
	// 					var doctorBooking = {
	// 						doctorId: results.list[i].doctorId,
	// 						doctorName: results.list[i].doctorName,
	// 						avatarUrl: results.list[i].avatarUrl,
	// 						bookingWeekList: [],
	// 					}
	// 					for(var j = 0; j < weekArray.length; j++){
	// 						var title = {
	// 							date: this.workbenchService.dateFormat(weekArray[j]),
	// 							title: this.workbenchService.getWeekTitle(j)
	// 						}
	// 						var dayBooking = {
	// 							date: this.workbenchService.dateFormat(weekArray[j]),
	// 							bookingList: [],
	// 							num: '',
	// 							string: '',
	// 							use: false,
	// 						}
	// 						// 日期是否过期
	// 						if(todayTime - (24 * 60 * 60 * 1000) < (new Date(this.workbenchService.dateFormatHasWord(dayBooking.date)).getTime())){
	// 							dayBooking.use = true;
	// 						}
	// 						if(results.list[i].serviceList.length > 0){
	// 							for(var k = 0; k < results.list[i].serviceList.length; k++){
	// 								//判断今天是否有预约
	// 								if(weekArray[j] == results.list[i].serviceList[k].bookingDate){
	// 									dayBooking.bookingList.push(results.list[i].serviceList[k]);
	// 								}
	// 							}
	// 						}
	// 						dayBooking.num = dayBooking.bookingList.length.toString();
	// 						dayBooking.string = JSON.stringify(dayBooking.bookingList);
	// 						doctorBooking.bookingWeekList.push(dayBooking);
	// 						if(i == 0){
	// 							weekBookingTitle.push(title);
	// 						}
	// 					}
	// 					doctorBookingList.push(doctorBooking);
	// 				}
	// 			}
	// 			this.hasDoctorBookingData = true;
	// 			this.weekBookingTitle = weekBookingTitle;
	// 			this.doctorBookingList = doctorBookingList;
	// 		}
	// 	}).catch((err) => {
	// 		const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
	// 		this.toastService.toast(toastCfg);
	// 	});
	// }
	//

	//
	// close() {
	// 	this.modalTab = false;
	// }
	//
	// showBooking(day, booking, type) {
	// 	this.hasDutyData = false;
	// 	this.doctorDutyList = [];
	// 	this.selected = {
	// 		doctor: booking.doctorName,
	// 		tab: type == 'all' ? '1' : '2',
	// 		type: type,
	// 	};
	// 	this.showBookinglist = JSON.parse(day.string);
	// 	this.modalTab = true;
	//
	// 	// 获取排班信息，如果日期为过期日期，查看排班则为当天排班，否则为未来排班
	// 	var doctordutysUrl = '';
	// 	if(day.use){
	// 		doctordutysUrl = this.url + '&doctor_id=' + booking.doctorId;
	// 		this.workbenchService.doctordutys(doctordutysUrl).then((data) => {
	// 			if(data.status == 'no'){
	// 		        const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
	// 		        this.toastService.toast(toastCfg);
	// 			}else{
	// 				var results = JSON.parse(JSON.stringify(data.results));
	// 				this.structureDuty(results);
	// 			}
	// 		}).catch((err) => {
	// 			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
	// 			this.toastService.toast(toastCfg);
	// 		});
	// 	}else{
	// 		doctordutysUrl = this.url + '&doctor_id=' + booking.doctorId + '&duty_date=' + this.workbenchService.dateFormatHasWord(day.date);
	// 		this.workbenchService.doctordaydutys(doctordutysUrl).then((data) => {
	// 			if(data.status == 'no'){
	// 		        const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
	// 		        this.toastService.toast(toastCfg);
	// 			}else{
	// 				var results = JSON.parse(JSON.stringify(data.results));
	// 				this.structureDuty(results);
	// 			}
	// 		}).catch((err) => {
	// 			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
	// 			this.toastService.toast(toastCfg);
	// 		});
	// 	}
	// }
	//
	// // 构造排班信息
	// structureDuty(results) {
	// 	if(results.doctors.length > 0){
	// 		if(results.doctors[0].doctorDutys.length > 0){
	// 			for(var i = 0; i < results.doctors[0].doctorDutys.length; i++){
	// 				var dutylist = [];
	// 				if(results.doctors[0].doctorDutys[i].timeList.length> 0){
	// 					//给时间排序
	// 					results.doctors[0].doctorDutys[i].timeList.sort(function(a,b){return Number(a.replace(':', '')) - Number(b.replace(':', ''))});
	// 					for(var j = 0; j < results.doctors[0].doctorDutys[i].timeList.length; j++){
	// 						var duty = {
	// 							date: results.doctors[0].doctorDutys[i].timeList[j],
	// 							use: '',
	// 						}
	// 						if(results.doctors[0].doctorDutys[i].selectedList.length){
	// 							for(var k = 0; k < results.doctors[0].doctorDutys[i].selectedList.length; k++){
	// 								if(results.doctors[0].doctorDutys[i].timeList[j] == results.doctors[0].doctorDutys[i].selectedList[k]){
	// 									duty.use = '已预约';
	// 								}
	// 							}
	// 						}
	// 						dutylist.push(duty);
	// 					}
	// 				}
	// 				results.doctors[0].doctorDutys[i].list = dutylist;
	// 			}
	// 		}
	// 		this.doctorDutyList = results.doctors[0].doctorDutys;
	// 	}
	// 	this.hasDutyData = true;
	// }
	//
	// changeSelected(value) {
	// 	this.selected.tab = value;
	// }
	//
	// info(_id) {
	// 	this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: _id}});
	// }
	//
	// goBooking(booking, day) {
	// 	// 判断日期是否过期
	// 	if(day.use){
	// 		// 判断该医生，当天是否排班，若无排班，则不可跳转
	// 		var hasDuty = false;
	// 		if(this.schedulinglist.length > 0){
	// 			for(var i = 0; i < this.schedulinglist.length; i++){
	// 				// 该医生
	// 				if(this.schedulinglist[i].adminId == booking.doctorId){
	// 					for(var j = 0; j < this.schedulinglist[i].weekScheduling.length; j++){
	// 						// 该天
	// 						if(this.schedulinglist[i].weekScheduling[j].dutyDay == this.workbenchService.dateFormatHasWord(day.date)){
	// 							// 是否有排班
	// 							if(this.schedulinglist[i].weekScheduling[j].dutyConfigList.length > 0){
	// 								hasDuty = true;
	// 							}
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 		if(hasDuty){
	// 			// 查找医生拥有的科室，并默认选择第一个
	// 			var serviceId = '';
	// 			if(this.doctorList.length > 0){
	// 				for(var i = 0; i < this.doctorList.length; i++){
	// 					if(booking.doctorId == this.doctorList[i].id){
	// 						// 科室列表
	// 						if(this.doctorList[i].serviceList.length > 0){
	// 							serviceId = this.doctorList[i].serviceList[0].serviceId;
	// 						}
	// 					}
	// 				}
	// 			}
	// 			if(serviceId == ''){
	// 				this.modalConfirm = {
	// 					text: booking.doctorName + '医生尚未分配科室，不可预约',
	// 				}
	// 				this.modalConfirmTab = true;
	// 			}else{
	// 				this.router.navigate(['./admin/booking'], {queryParams: {type: 'createScheduling', serviceId: serviceId, doctorId: booking.doctorId, date: this.workbenchService.dateFormatHasWord(day.date)}});
	// 			}
	// 		}else{
	// 			this.modalConfirm = {
	// 				text: booking.doctorName + '医生' + day.date + '尚未排班，不可预约',
	// 			}
	// 			this.modalConfirmTab = true;
	// 		}
	// 	}
	// }
	//
	// closeConfirm() {
	// 	this.modalConfirmTab = false;
	// }
}

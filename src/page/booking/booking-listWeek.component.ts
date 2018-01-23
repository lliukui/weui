import { Component, OnInit }           from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';
import { ToptipsService }              from '../../weui/toptips';
import { ToastService }                from '../../weui/toast';

import { BookingService }              from './booking.service';
import { PageService }                 from '../page.service';

@Component({
	selector: 'app-booking-listWeek',
	templateUrl: './booking-listWeek.component.html',
	styleUrls: ['./booking-listWeek.component.scss'],
})
export class BookingListWeek implements OnInit{
	   loadingShow: boolean;
	   url: string;
	   servicelist: any[];
	   bookinglist: any[];
	   weeklist: any[];
	   weektitle: any[];
	   timelist: any[];
	   weekNum: number;
	   hasData: boolean;

	constructor(
		private bookingService: BookingService,
		private router: Router,
		private toast: ToastService,
		private toptips: ToptipsService,
		private pageService: PageService,
	) {}

	ngOnInit(): void {
		//timelist
		this.timelist = [
			{key: '08:00'},
			{key: '08:20'},
			{key: '08:30'},
			{key: '08:40'},
			{key: '09:00'},
			{key: '09:20'},
			{key: '09:30'},
			{key: '09:40'},
			{key: '10:00'},
			{key: '10:20'},
			{key: '10:30'},
			{key: '10:40'},
			{key: '11:00'},
			{key: '11:20'},
			{key: '11:30'},
			{key: '11:40'},
			{key: '12:00'},
			{key: '12:20'},
			{key: '12:30'},
			{key: '12:40'},
			{key: '13:00'},
			{key: '13:20'},
			{key: '13:30'},
			{key: '13:40'},
			{key: '14:00'},
			{key: '14:20'},
			{key: '14:30'},
			{key: '14:40'},
			{key: '15:00'},
			{key: '15:20'},
			{key: '15:30'},
			{key: '15:40'},
			{key: '16:00'},
			{key: '16:20'},
			{key: '16:30'},
			{key: '16:40'},
			{key: '17:00'},
			{key: '17:20'},
			{key: '17:30'},
			{key: '17:40'},
			{key: '18:00'},
			{key: '18:20'},
			{key: '18:30'},
			{key: '18:40'},
			{key: '19:00'},
			{key: '19:20'},
			{key: '19:30'},
			{key: '19:40'},
			{key: '20:00'},
			{key: '20:20'},
			{key: '20:30'},
			{key: '20:40'},
			{key: '21:00'},
			{key: '21:20'},
			{key: '21:30'},
			{key: '21:40'},
			{key: '22:00'},
			{key: '22:20'},
			{key: '22:30'},
			{key: '22:40'},
			{key: '23:00'},
			{key: '23:20'},
			{key: '23:30'},
			{key: '23:40'},
		];
		// this.selectedTab = 0;
		this.url = '?username=' + localStorage.getItem('username')
			 + '&token=' + localStorage.getItem('token');
		// // this.getDoctorList();
		 this.servicelist = [];
		 this.getServiceList();
        //
		// // 获取家长信息
		// this.userList = [];
		this.loadingShow = true;
		this.weekNum = 0;
		this.weeklist = [];

    }

	//查询
	search() {
		//日历
		var urlOptions = this.getUrlOptios();
		this.getList(urlOptions + '&weekindex=' + this.weekNum, 'week');
	}

	//科室列表
	getServiceList() {
		var urlOptions = this.url + '&clinic_id=' + localStorage.getItem('clinicId');
		this.bookingService.servicelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
		        this.toptips.warn(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for(var i = 0; i < results.servicelist.length; i++){
						results.servicelist[i].color = this.pageService.colorList()[i % 10];
						results.servicelist[i].infoList = [];
					}
				}
				this.servicelist = results.servicelist;

				// 根据科室获取科室颜色
				// //week列表
				// this.getList(this.url + '&clinic_id=' + this.adminService.getUser().clinicId + '&weekindex=0', 'week');
				// //booking列表
				// this.getList(this.url + '&clinic_id=' + this.adminService.getUser().clinicId, 'list');
				this.search();
			}
		}).catch((err) => {
			this.toptips.warn('服务器错误');
		});
	}

	//预约列表
	getList(urlOptions, type) {
		this.weeklist = [];
		this.bookingService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
		        this.toptips.warn(data.errorMsg);
			}else{
				var todayTime = new Date(this.pageService.getDayByDate(new Date())).getTime();
				if(type == 'week'){
					var weekbooks = JSON.parse(JSON.stringify(data.results)).weekbooks;
					var weekArray = this.pageService.getWeekByNumber(this.weekNum);
					//weeklist
					var weeklist = new Array();
					//weektitle
					var weektitle = new Array();
					for(var i = 0; i < 7; i++){
						var title = {
							date: this.pageService.dateFormat(weekArray[i]),
							title: this.pageService.getWeekTitle(i)
						}
						weektitle.push(title);
						var week = {
							date: this.pageService.dateFormat(weekArray[i]),
							title: this.pageService.getWeekTitle(i),
							use: true,
							timeList: [
								{key: '08:00', value: []},
								{key: '08:20', value: []},
								{key: '08:30', value: []},
								{key: '08:40', value: []},
								{key: '09:00', value: []},
								{key: '09:20', value: []},
								{key: '09:30', value: []},
								{key: '09:40', value: []},
								{key: '10:00', value: []},
								{key: '10:20', value: []},
								{key: '10:30', value: []},
								{key: '10:40', value: []},
								{key: '11:00', value: []},
								{key: '11:20', value: []},
								{key: '11:30', value: []},
								{key: '11:40', value: []},
								{key: '12:00', value: []},
								{key: '12:20', value: []},
								{key: '12:30', value: []},
								{key: '12:40', value: []},
								{key: '13:00', value: []},
								{key: '13:20', value: []},
								{key: '13:30', value: []},
								{key: '13:40', value: []},
								{key: '14:00', value: []},
								{key: '14:20', value: []},
								{key: '14:30', value: []},
								{key: '14:40', value: []},
								{key: '15:00', value: []},
								{key: '15:20', value: []},
								{key: '15:30', value: []},
								{key: '15:40', value: []},
								{key: '16:00', value: []},
								{key: '16:20', value: []},
								{key: '16:30', value: []},
								{key: '16:40', value: []},
								{key: '17:00', value: []},
								{key: '17:20', value: []},
								{key: '17:30', value: []},
								{key: '17:40', value: []},
								{key: '18:00', value: []},
								{key: '18:20', value: []},
								{key: '18:30', value: []},
								{key: '18:40', value: []},
								{key: '19:00', value: []},
								{key: '19:20', value: []},
								{key: '19:30', value: []},
								{key: '19:40', value: []},
								{key: '20:00', value: []},
								{key: '20:20', value: []},
								{key: '20:30', value: []},
								{key: '20:40', value: []},
								{key: '21:00', value: []},
								{key: '21:20', value: []},
								{key: '21:30', value: []},
								{key: '21:40', value: []},
								{key: '22:00', value: []},
								{key: '22:20', value: []},
								{key: '22:30', value: []},
								{key: '22:40', value: []},
								{key: '23:00', value: []},
								{key: '23:20', value: []},
								{key: '23:30', value: []},
								{key: '23:40', value: []},
							]
						}
						for(var j = 0; j < week.timeList.length; j++){
							// 科室列表
							var serviceListData = JSON.parse(JSON.stringify(this.servicelist));

							//遍历返回结果，将预约信息添加进timeList
							for(var k = 0; k < weekbooks.length; k++){
								if(this.pageService.dateFormat(weekArray[i]) == weekbooks[k].bookingDate && week.timeList[j].key == weekbooks[k].time){
									// weekbooks[k].servicesLength = weekbooks[k].services.length;
									// week.timeList[j].value.push(weekbooks[k]);
									// 添加科室列表
									if(serviceListData.length > 0){
										for(var m = 0; m < serviceListData.length; m++){
											if(serviceListData[m].serviceId == weekbooks[k].services[0].serviceId){
												serviceListData[m].infoList.push(weekbooks[k]);
											}
										}
									}
								}
							}
							week.timeList[j].value = serviceListData;
						}
						//日期若未过去，则不可修改，只可查看
						if((new Date(weekArray[i]).getTime()) < todayTime){
							week.use = false;
						}else{
							week.use = true;
						}
						weeklist.push(week);
					}
					this.weektitle = weektitle;
					this.weeklist = weeklist;
					console.log(this.weeklist);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.weekbooks.length > 0){
						for(var i = 0; i < results.weekbooks.length; i++){
							if((new Date(this.pageService.dateFormatHasWord(results.weekbooks[i].bookingDate)).getTime()) < todayTime){
								results.weekbooks[i].use = false;
							}else{
								results.weekbooks[i].use = true;
							}
						}
					}
					this.bookinglist = results.weekbooks;
				}
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch((err) => {
			this.toptips.warn('服务器错误');
		});
	}

	//上一周
	prec() {
		this.weekNum--;
		var urlOptions = this.getUrlOptios();
		urlOptions += '&weekindex=' + this.weekNum;
		this.getList(urlOptions, 'week');
	}

	//本周
	now() {
		this.weekNum = 0;
		var urlOptions = this.getUrlOptios();
		urlOptions += '&weekindex=0';
		this.getList(urlOptions, 'week');
	}

	//下一周
	next() {
		this.weekNum++;
		var urlOptions = this.getUrlOptios();
		urlOptions += '&weekindex=' + this.weekNum;
		this.getList(urlOptions, 'week');
	}

	getUrlOptios() {
		var urlOptions = this.url;
		urlOptions += '&clinic_id=' + 1;
		return urlOptions;
	}

	goUrl(_url) {
        this.router.navigate(['./' + _url]);
    }
}

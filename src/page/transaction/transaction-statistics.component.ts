import { Component, OnInit, ViewChild }           from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';
import { ToptipsService }              from '../../weui/toptips';
import { ToastService }                from '../../weui/toast';
import { MaskComponent } 			   from '../../weui/mask';

import { TransactionService }          from './transaction.service';
import { PageService }                 from '../page.service';

@Component({
	selector: 'app-scheduling',
	templateUrl: './transaction-statistics.component.html',
	styleUrls: ['./transaction.component.scss'],
	// animations: [slideInDownAnimation],
})
export class TransactionStatisticsComponent{
	loadingShow: boolean;
	hasData: boolean;
	tranList: any[];
	total: {
		needAmount: string,
		giveAmount: string,
		paidUp: string,
		bookingFee: string,
		cash: string,
		online: string,
		balance: string,
		gua: string,
		total: string,
		discount: string,
	}
	url: string;
	doctorlist: any[];
	servicelist: any[];
	searchInfo: {
		doctor_id: string,
		service_id: string,
		user_name: string,
		b_time: string,
		b_time_text: string,
		b_time_num: number,
		l_time: string,
		l_time_text: string,
		l_time_num: number,
		b_amount: string,
		l_amount: string,
		type: string,
		pay_way: string,
	}
	commonList: any[];
	modalInfoTab: boolean = false;
	selector: {
		doctorName: string,
		serviceName: string,
		refereeName: string,
		remark: string,
	}
	_status: boolean = false;
    mode: string = 'slide';
    position: string = 'top';
    backdrop: boolean = true;

	constructor(
		private transactionService: TransactionService,
		private router: Router,
		private toast: ToastService,
		private toptips: ToptipsService,
		private pageService: PageService,
	) {}

	ngOnInit() {
		this.loadingShow = true;
		this.hasData = false;
		this.tranList = [];
		this.total = {
			needAmount: '',
			giveAmount: '',
			paidUp: '',
			bookingFee: '',
			cash: '',
			online: '',
			balance: '',
			gua: '',
			total: '',
			discount: '',
		}

		var todayDate = this.pageService.getDayByDate(new Date());
		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			user_name: '',
			b_time: todayDate,
			b_time_text: this.pageService.dateFormat(todayDate),
			b_time_num: new Date(todayDate).getTime(),
			l_time: todayDate,
			l_time_text: this.pageService.dateFormat(todayDate),
			l_time_num: new Date(todayDate).getTime(),
			b_amount: '',
			l_amount: '',
			type: '1,3',
			pay_way: '',
		}

		this.commonList = [
			{id: 1},
			{id: 2},
		]

		this.selector = {
			doctorName: '',
			serviceName: '',
			refereeName: '',
			remark: '',
		}

		this.url = '?username=' + localStorage.getItem('username')
			 + '&token=' + localStorage.getItem('token')
			 + '&clinic_id=' + localStorage.getItem('clinicId');

	    this.getDoctorList();
		this.servicelist = [];
		this.getServiceList();

		this.search('');
	}

	changeType(_value) {
		this.searchInfo.type = _value;
		this.search('');
	}

	search(type) {
		var urlOptions = this.url;
		if(this.searchInfo.user_name != ''){
			urlOptions += '&user_name=' + this.searchInfo.user_name;
		}
		if(this.searchInfo.b_time != ''){
			urlOptions += '&b_time=' + this.searchInfo.b_time;
		}
		if(this.searchInfo.l_time != ''){
			urlOptions += '&l_time=' + this.searchInfo.l_time;
		}
		if(this.searchInfo.b_amount != ''){
			urlOptions += '&b_amount=' + this.searchInfo.b_amount;
		}
		if(this.searchInfo.l_amount != ''){
			urlOptions += '&l_amount=' + this.searchInfo.l_amount;
		}
		if(this.searchInfo.type != ''){
			if(this.searchInfo.type == '1,3'){
				urlOptions += '&typelist=' + this.searchInfo.type;
			}else{
				urlOptions += '&type=' + this.searchInfo.type;
			}
		}
		if(this.searchInfo.pay_way != ''){
			urlOptions += '&pay_way=' + this.searchInfo.pay_way;
		}
		if(this.searchInfo.service_id != ''){
			urlOptions += '&service_id=' + this.searchInfo.service_id;
		}
		if(this.searchInfo.doctor_id != ''){
			urlOptions += '&doctor_id=' + this.searchInfo.doctor_id;
		}

		if(type == ''){
			this.getData(urlOptions);
		}else{
			//window.location.href = config.baseHTTP + '/mebcrm/transtatisticsexport'+ urlOptions;
		}
	}

	getData(urlOptions) {
		this.transactionService.transtatistics(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toptips.warn(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length>0){
					this.total = {
						needAmount: this.pageService.toDecimal2(results.total.needAmount),
						giveAmount: this.pageService.toDecimal2(results.total.giveAmount),
						paidUp: this.pageService.toDecimal2(results.total.paidUp),
						bookingFee: this.pageService.toDecimal2(results.total.bookingFee),
						cash: this.pageService.toDecimal2(results.total.cash),
						online: this.pageService.toDecimal2(results.total.online),
						balance: this.pageService.toDecimal2(results.total.balance),
						gua: this.pageService.toDecimal2(results.total.gua),
						total: this.pageService.toDecimal2(results.total.total),
						discount: this.pageService.toDecimal2(results.total.discount),
					}
					for(var i=0;i<results.list.length;i++){
						var numList = [
							'balance',
							'bookingFee',
							'cash',
							'discount',
							'giveAmount',
							'gua',
							'needAmount',
							'online',
							'paidUp',
							'total',
						]
						for(var j = 0; j < numList.length; j++){
							results.list[i][numList[j]] = this.pageService.toDecimal2(results.list[i][numList[j]]);
						}
					}
				}
				this.tranList = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		});
	}

	// 选择时间
	changeDate(_value, key) {
		this.searchInfo[key] = JSON.parse(_value).value;
		this.searchInfo[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
	}

	//医生列表
	getDoctorList(){
		var adminlistUrl = this.url + '&clinic_id='
			 + 1 + '&role=2';
		this.transactionService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this.toptips.warn(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorlist = results.adminlist;
				this.doctorlist.unshift({id: '', realName: '请选择医生'});
			}
		})
	}

	//科室列表
	getServiceList() {
		var urlOptions = this.url + '&clinic_id=' + 1;
		this.transactionService.servicelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toptips.warn(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for(var i = 0; i < results.servicelist.length; i++){
						//results.servicelist[i].color = this.transactionService.colorList()[i % 10];
						results.servicelist[i].infoList = [];
					}
				}
				this.servicelist = results.servicelist;
			}
		})
	}

	info(tran) {
		this.selector = {
			doctorName: tran.doctorName,
			serviceName: tran.serviceName,
			refereeName: tran.refereeName,
			remark: tran.remark,
		}
		this.modalInfoTab = true;
	}

	closeInfo() {
		this.modalInfoTab = false;
		this.selector = {
			doctorName: '',
			serviceName: '',
			refereeName: '',
			remark: '',
		}
	}

	toggleOpened(): void {
        this._status = !this._status;
    }

    openStart() {
        // console.log('openStart');
    }

    opened() {
        // console.log('opened');
    }

    closeStart() {
        // console.log('closeStart');
    }

    closed() {
        // console.log('closed');
    }

	checkInfo(tran,type){
		sessionStorage.setItem('statisticsInfo', JSON.stringify(tran));
		sessionStorage.setItem('statisticsType', type);
		this.router.navigate(['./transaction/statisticsInfo']);
	}

	checkTotalInfo(total,type){
		sessionStorage.setItem('statisticsTotal', JSON.stringify(total));
		sessionStorage.setItem('statisticsType', type);
		this.router.navigate(['./transaction/statisticsInfo']);
	}
}

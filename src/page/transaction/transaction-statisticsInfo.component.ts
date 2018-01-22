import { Component, OnInit, ViewChild }           from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';
import { ToptipsService }              from '../../weui/toptips';
import { ToastService }                from '../../weui/toast';
import { MaskComponent } 			   from '../../weui/mask';

import { PageService }                 from '../page.service';

@Component({
	selector: 'app-scheduling',
	templateUrl: './transaction-statisticsInfo.component.html',
	styleUrls: ['./transaction.component.scss'],
	// animations: [slideInDownAnimation],
})
export class TransactionStatisticsInfoComponent{
	loadingShow: boolean;
	hasData: boolean;
	info: {
		childName: string,
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
		time:string,
		doctorName:string,
		serviceName:string,
		refereeName:string,
		remark:string,
		guastatus:string,
	}
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
	type:string;

	constructor(
		private router: Router,
		private toast: ToastService,
		private toptips: ToptipsService,
		private pageService: PageService,
	) {}

	ngOnInit() {
		this.loadingShow = true;
		this.hasData = false;
		this.info = {
			childName:'',
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
			time:'',
			doctorName:'',
			serviceName:'',
			refereeName:'',
			remark:'',
			guastatus:'',
		}
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
		this.type = '';

		this.getData();
	}

	getData() {
		var info =  JSON.parse(sessionStorage.getItem('statisticsInfo'));
		var total = JSON.parse(sessionStorage.getItem('statisticsTotal'));
		this.type = JSON.parse(sessionStorage.getItem('statisticsType'));
		if(info != null){
			this.info = {
				childName:info.childName,
				needAmount: this.pageService.toDecimal2(info.needAmount),
				giveAmount: this.pageService.toDecimal2(info.giveAmount),
				paidUp: this.pageService.toDecimal2(info.paidUp),
				bookingFee: this.pageService.toDecimal2(info.bookingFee),
				cash: this.pageService.toDecimal2(info.cash),
				online: this.pageService.toDecimal2(info.online),
				balance: this.pageService.toDecimal2(info.balance),
				gua: this.pageService.toDecimal2(info.gua),
				total: this.pageService.toDecimal2(info.total),
				discount: this.pageService.toDecimal2(info.discount),
				time: info.time,
				doctorName:info.doctorName,
				serviceName:info.serviceName,
				refereeName:info.refereeName,
				remark:info.remark,
				guastatus:info.guastatus,
			}
		}
		if(total != null){
			this.total = {
				needAmount: this.pageService.toDecimal2(total.needAmount),
				giveAmount: this.pageService.toDecimal2(total.giveAmount),
				paidUp: this.pageService.toDecimal2(total.paidUp),
				bookingFee: this.pageService.toDecimal2(total.bookingFee),
				cash: this.pageService.toDecimal2(total.cash),
				online: this.pageService.toDecimal2(total.online),
				balance: this.pageService.toDecimal2(total.balance),
				gua: this.pageService.toDecimal2(total.gua),
				total: this.pageService.toDecimal2(total.total),
				discount: this.pageService.toDecimal2(total.discount),
			}
		}
	}
}

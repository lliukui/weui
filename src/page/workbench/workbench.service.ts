import { Http }                          from '@angular/http';
import { Injectable }                    from '@angular/core';

import { Data }                          from '../data';
import { appConfig }                        from '../config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class WorkbenchService{
	url = appConfig.baseHTTP;

	constructor(
        private http: Http,
    ) {}

	//查询后台用户
	private adminlistUrl = this.url + '/mebcrm/adminlist';
	adminlist(urlOptions): Promise<Data>{
		return this.http.get(this.adminlistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//后台用户排班记录
	private admindutyUrl = this.url + '/mebcrm/adminduty';
	adminduty(urlOptions): Promise<Data>{
		return this.http.get(this.admindutyUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询所有医生的科室信息
	private doctorbookingUrl = this.url + '/mebcrm/doctorbooking';
	doctorbooking(urlOptions): Promise<Data>{
		return this.http.get(this.doctorbookingUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询宝宝科室列表
	private servicelistUrl = this.url + '/mebcrm/servicelist';
	servicelist(urlOptions): Promise<Data>{
		return this.http.get(this.servicelistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}
}

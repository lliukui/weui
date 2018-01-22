import { Http }                          from '@angular/http';
import { Injectable }                    from '@angular/core';

import { Data }                          from '../data';
import { appConfig }                        from '../config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class TransactionService{
	url = appConfig.baseHTTP;

	constructor(
        private http: Http,
    ) {}

	//交易
	private tranStatisticsUrl = this.url + '/mebcrm/transtatistics';
	transtatistics(urlOptions): Promise<Data>{
		return this.http.get(this.tranStatisticsUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询后台用户
	private adminlistUrl = this.url + '/mebcrm/adminlist';
	adminlist(urlOptions): Promise<Data>{
		return this.http.get(this.adminlistUrl + urlOptions)
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

import { Http }                          from '@angular/http';
import { Injectable }                    from '@angular/core';

import { Data }                          from '../data';
import { appConfig }                        from '../config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BookingService{
	url = appConfig.baseHTTP;

	constructor(
        private http: Http,
    ) {}

	//查询预约列表
	private searchbookingUrl = this.url + '/mebcrm/searchbooking';
	searchbooking(urlOptions): Promise<Data>{
		return this.http.get(this.searchbookingUrl + urlOptions)
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

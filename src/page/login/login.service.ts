import { Injectable }                       from '@angular/core';
import { Headers, Http, RequestOptions }    from '@angular/http';
import { Observable }                       from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';

import { Data }                             from '../data';
import { appConfig }                           from '../config';

@Injectable()
export class LoginService {
	url = appConfig.baseHTTP;

  	constructor(
		private http: Http,
	) {

	}

	private adminloginUrl = this.url + '/mebcrm/adminlogin';
	adminlogin(params): Promise<Data>{
		return this.http.post(this.adminloginUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

}
